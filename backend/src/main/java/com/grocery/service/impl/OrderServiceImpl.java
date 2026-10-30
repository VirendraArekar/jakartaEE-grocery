package com.grocery.service.impl;

import com.grocery.dto.OrderRequestDTO;
import com.grocery.dto.OrderResponseDTO;
import com.grocery.exception.InsufficientStockException;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.model.Customer;
import com.grocery.model.Order;
import com.grocery.model.OrderItem;
import com.grocery.model.OrderStatus;
import com.grocery.model.Product;
import com.grocery.repository.CustomerRepository;
import com.grocery.repository.OrderRepository;
import com.grocery.repository.ProductRepository;
import com.grocery.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * ============================================================================
 * JAKARTA EE REVISION POINT: ACID Transactions & Concurrency Handling
 * ============================================================================
 * - @Transactional ensures:
 *     * Atomicity: Entire order (customer check, stock deduction, order items, order header)
 *       either commits together or rolls back completely if an error occurs.
 *     * Consistency & Isolation: ProductRepository.findByIdWithLock() locks the row
 *       in MS SQL Server, preventing race condition overselling across concurrent checkouts.
 * - @CacheEvict flushes the Redis product cache so real-time inventory is visible.
 * ============================================================================
 */
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            ProductRepository productRepository,
                            CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    @CacheEvict(value = {"productList", "products"}, allEntries = true)
    public OrderResponseDTO placeOrder(OrderRequestDTO request) {
        // 1. Find or create Customer
        Customer customer = customerRepository.findByEmail(request.getCustomerEmail())
                .orElseGet(() -> {
                    Customer newCustomer = new Customer(
                            request.getCustomerName(),
                            request.getCustomerEmail(),
                            request.getCustomerPhone(),
                            request.getDeliveryAddress()
                    );
                    return customerRepository.save(newCustomer);
                });

        // 2. Instantiate Order
        Order order = new Order();
        String orderNumber = "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        order.setOrderNumber(orderNumber);
        order.setCustomer(customer);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setDeliveryNotes(request.getDeliveryNotes());

        // 3. Process each line item with Pessimistic Locking
        for (OrderRequestDTO.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findByIdWithLock(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new InsufficientStockException(String.format(
                        "Insufficient stock for '%s'. Available: %d, Requested: %d",
                        product.getName(), product.getStockQuantity(), itemReq.getQuantity()
                ));
            }

            // Deduct inventory
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            // Create OrderItem
            OrderItem orderItem = new OrderItem(product, itemReq.getQuantity(), product.getPrice());
            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);
        return mapToDTO(savedOrder);
    }

    @Override
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return mapToDTO(order);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public OrderResponseDTO updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        order.setStatus(status);
        Order updated = orderRepository.save(order);
        return mapToDTO(updated);
    }

    private OrderResponseDTO mapToDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setDeliveryNotes(order.getDeliveryNotes());
        dto.setCreatedAt(order.getCreatedAt());

        if (order.getCustomer() != null) {
            dto.setCustomerName(order.getCustomer().getFullName());
            dto.setCustomerEmail(order.getCustomer().getEmail());
            dto.setDeliveryAddress(order.getCustomer().getDeliveryAddress());
        }

        if (order.getItems() != null) {
            List<OrderResponseDTO.OrderItemResponse> items = order.getItems().stream()
                    .map(item -> new OrderResponseDTO.OrderItemResponse(
                            item.getProduct().getId(),
                            item.getProduct().getName(),
                            item.getQuantity(),
                            item.getUnitPrice(),
                            item.getSubtotal()
                    ))
                    .collect(Collectors.toList());
            dto.setItems(items);
        }

        return dto;
    }
}

