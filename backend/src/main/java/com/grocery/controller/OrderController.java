package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.dto.OrderRequestDTO;
import com.grocery.dto.OrderResponseDTO;
import com.grocery.model.OrderStatus;
import com.grocery.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponseDTO>> placeOrder(
            @Valid @RequestBody OrderRequestDTO request) {
        OrderResponseDTO response = orderService.placeOrder(request);
        return new ResponseEntity<>(ApiResponse.ok("Order placed successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getAllOrders() {
        List<OrderResponseDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.ok("Orders retrieved successfully", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderById(@PathVariable Long id) {
        OrderResponseDTO order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        OrderResponseDTO updated = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated to " + status, updated));
    }
}

