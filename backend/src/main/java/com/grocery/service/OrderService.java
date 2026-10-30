package com.grocery.service;

import com.grocery.dto.OrderRequestDTO;
import com.grocery.dto.OrderResponseDTO;
import com.grocery.model.OrderStatus;

import java.util.List;

public interface OrderService {
    OrderResponseDTO placeOrder(OrderRequestDTO request);
    List<OrderResponseDTO> getAllOrders();
    OrderResponseDTO getOrderById(Long id);
    OrderResponseDTO updateOrderStatus(Long id, OrderStatus status);
}

