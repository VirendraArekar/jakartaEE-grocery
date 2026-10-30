package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.dto.ProductDTO;
import com.grocery.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        List<ProductDTO> products = productService.getProducts(categoryId, search);
        return ResponseEntity.ok(ApiResponse.ok("Products retrieved successfully", products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.ok(product));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO created = productService.createProduct(productDTO);
        return new ResponseEntity<>(ApiResponse.ok("Product created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO updated = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(ApiResponse.ok("Product updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted successfully", null));
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ApiResponse<ProductDTO>> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        int delta = request.getOrDefault("delta", 0);
        ProductDTO updated = productService.updateStock(id, delta);
        return ResponseEntity.ok(ApiResponse.ok("Stock updated successfully", updated));
    }
}

