package com.grocery.service.impl;

import com.grocery.dto.ProductDTO;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.model.Category;
import com.grocery.model.Product;
import com.grocery.repository.CategoryRepository;
import com.grocery.repository.ProductRepository;
import com.grocery.service.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Cacheable(value = "productList", key = "'cat_' + (#categoryId != null ? #categoryId : 'all') + '_q_' + (#search != null ? #search : 'all')")
    public List<ProductDTO> getProducts(Long categoryId, String search) {
        List<Product> products = productRepository.searchProducts(categoryId, search);
        return products.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "products", key = "#id")
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDTO(product);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    @CacheEvict(value = {"productList", "categories"}, allEntries = true)
    public ProductDTO createProduct(ProductDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Product product = new Product(
                dto.getName(),
                dto.getDescription(),
                dto.getPrice(),
                dto.getStockQuantity(),
                dto.getUnit(),
                dto.getImageUrl(),
                dto.getOrganic() != null ? dto.getOrganic() : false,
                category
        );

        Product saved = productRepository.save(product);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    @CacheEvict(value = {"productList", "products", "categories"}, allEntries = true)
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setUnit(dto.getUnit());
        product.setImageUrl(dto.getImageUrl());
        product.setOrganic(dto.getOrganic());
        product.setCategory(category);

        Product updated = productRepository.save(product);
        return mapToDTO(updated);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    @CacheEvict(value = {"productList", "products", "categories"}, allEntries = true)
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    @CacheEvict(value = {"productList", "products"}, allEntries = true)
    public ProductDTO updateStock(Long id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setStockQuantity(product.getStockQuantity() + quantity);
        Product saved = productRepository.save(product);
        return mapToDTO(saved);
    }

    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setUnit(product.getUnit());
        dto.setImageUrl(product.getImageUrl());
        dto.setOrganic(product.getOrganic());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        return dto;
    }
}

