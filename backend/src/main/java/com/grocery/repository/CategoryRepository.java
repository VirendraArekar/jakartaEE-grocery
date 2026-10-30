package com.grocery.repository;

import com.grocery.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ============================================================================
 * JAKARTA EE REVISION POINT: JPQL (Jakarta Persistence Query Language)
 * ============================================================================
 * - JPQL operates on the entity object model rather than directly on database tables.
 * - Named parameters (':name') protect against SQL Injection attacks.
 * ============================================================================
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.products WHERE c.id = :id")
    Optional<Category> findByIdWithProducts(@Param("id") Long id);
}

