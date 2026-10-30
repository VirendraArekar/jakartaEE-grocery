package com.grocery.service.impl;

import com.grocery.dto.CategoryDTO;
import com.grocery.exception.ResourceNotFoundException;
import com.grocery.model.Category;
import com.grocery.repository.CategoryRepository;
import com.grocery.service.CategoryService;
import jakarta.transaction.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ============================================================================
 * JAKARTA EE REVISION POINT: @Transactional (jakarta.transaction.Transactional)
 * ============================================================================
 * - Uses the standard Jakarta EE @Transactional annotation instead of Spring's proprietary one.
 * - Supports rollbackOn, dontRollbackOn, and TxType (REQUIRED, REQUIRES_NEW, MANDATORY, etc.).
 * - Redis Caching is integrated seamlessly with @Cacheable and @CacheEvict.
 * ============================================================================
 */
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Cacheable(value = "categories", key = "'all'")
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "categories", key = "#id")
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToDTO(category);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    @CacheEvict(value = {"categories", "productList"}, allEntries = true)
    public CategoryDTO createCategory(CategoryDTO dto) {
        Category category = new Category(dto.getName(), dto.getDescription(), dto.getIconUrl());
        Category saved = categoryRepository.save(category);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    @CacheEvict(value = {"categories", "productList"}, allEntries = true)
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setIconUrl(dto.getIconUrl());

        Category updated = categoryRepository.save(category);
        return mapToDTO(updated);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    @CacheEvict(value = {"categories", "productList", "products"}, allEntries = true)
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDTO mapToDTO(Category category) {
        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getIconUrl(),
                category.getProducts() != null ? category.getProducts().size() : 0
        );
    }
}

