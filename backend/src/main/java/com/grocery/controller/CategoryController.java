package com.grocery.controller;

import com.grocery.dto.ApiResponse;
import com.grocery.dto.CategoryDTO;
import com.grocery.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategories() {
        List<CategoryDTO> list = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.ok("Categories retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> getCategoryById(@PathVariable Long id) {
        CategoryDTO category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.ok(category));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO created = categoryService.createCategory(categoryDTO);
        return new ResponseEntity<>(ApiResponse.ok("Category created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO updated = categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok(ApiResponse.ok("Category updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.ok("Category deleted successfully", null));
    }
}

