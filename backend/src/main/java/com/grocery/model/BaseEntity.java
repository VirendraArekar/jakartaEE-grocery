package com.grocery.model;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Version;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * ============================================================================
 * JAKARTA EE REVISION POINT: @MappedSuperclass & Lifecycle Callbacks
 * ============================================================================
 * 1. @MappedSuperclass:
 *    - Instructs Jakarta Persistence that this class designates an abstract or
 *      concrete class whose mapping information is applied to the entities that
 *      inherit from it.
 *    - It DOES NOT generate a separate table in the database.
 *
 * 2. @Version (Optimistic Locking):
 *    - Jakarta Persistence uses this field to detect concurrent modifications.
 *    - Prevents "lost updates" without holding expensive database row-level locks.
 *    - If two transactions read the same entity version and both attempt to commit,
 *      the second will throw an OptimisticLockException.
 *
 * 3. Lifecycle Callbacks:
 *    - @PrePersist: Executed before EntityManager.persist() commits the row.
 *    - @PreUpdate: Executed before an existing entity is updated in the database.
 *    - Other lifecycle annotations: @PostPersist, @PostUpdate, @PreRemove,
 *      @PostRemove, @PostLoad.
 * ============================================================================
 */
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    /**
     * Jakarta Persistence Optimistic Locking field
     */
    @Version
    @Column(name = "version")
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

