package com.grocery.service;

import com.grocery.dto.ProductDTO;
import java.util.List;

public interface ProductService {
    List<ProductDTO> getProducts(Long categoryId, String search);
    ProductDTO getProductById(Long id);
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO updateProduct(Long id, ProductDTO productDTO);
    void deleteProduct(Long id);
    ProductDTO updateStock(Long id, int quantity);
}

