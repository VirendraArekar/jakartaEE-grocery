package com.grocery.repository;

import com.grocery.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

/**
 * ============================================================================
 * JAKARTA EE REVISION POINT: Locking Modes in Jakarta Persistence
 * ============================================================================
 * 1. LockModeType.OPTIMISTIC:
 *    - Validates version column at transaction commit.
 * 2. LockModeType.PESSIMISTIC_WRITE:
 *    - Acquires a direct SELECT ... FOR UPDATE database lock on MS SQL Server.
 *    - Ideal for high-concurrency inventory decrement operations.
 * ============================================================================
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByOrganicTrue();

    @Query("SELECT p FROM Product p WHERE (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Product> searchProducts(@Param("categoryId") Long categoryId, @Param("search") String search);

    /**
     * Pessimistic lock used during order checkout to ensure accurate inventory decrement
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithLock(@Param("id") Long id);
}

