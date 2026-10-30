package com.grocery.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================================
 * JAKARTA EE REVISION POINT: @Entity, @Table, @OneToMany, and Validation
 * ============================================================================
 * 1. @Entity:
 *    - Specifies that the class is an entity. Jakarta Persistence requires a
 *      no-arg constructor and a primary key (@Id).
 *
 * 2. @Table:
 *    - Allows customization of table name, schema, catalog, unique constraints,
 *      and indexes (MS SQL Server will generate the specified clustered/non-clustered index).
 *
 * 3. @OneToMany:
 *    - 'mappedBy': Identifies the field in the child entity (Product.category) that
 *      owns the foreign key relationship.
 *    - 'cascade = CascadeType.ALL': Propagates all EntityManager operations
 *      (PERSIST, MERGE, REMOVE, REFRESH, DETACH) from parent to children.
 *    - 'orphanRemoval = true': When a child is removed from the collection,
 *      Jakarta Persistence deletes the corresponding record from the DB table.
 *    - 'fetch = FetchType.LAZY': Child collection is loaded on-demand, preventing
 *      premature and expensive SQL JOIN queries.
 *
 * 4. Jakarta Validation (@NotBlank, @Size):
 *    - Validates inputs before persisting or during REST controller input binding.
 * ============================================================================
 */
@Entity
@Table(
    name = "categories",
    indexes = {
        @Index(name = "idx_category_name", columnList = "name", unique = true)
    }
)
public class Category extends BaseEntity {

    @NotBlank(message = "Category name cannot be blank")
    @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
    @Column(name = "name", nullable = false, length = 50, unique = true)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "icon_url", length = 255)
    private String iconUrl;

    @OneToMany(
        mappedBy = "category",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    @JsonIgnoreProperties("category")
    private List<Product> products = new ArrayList<>();

    public Category() {
    }

    public Category(String name, String description, String iconUrl) {
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
    }

    // Helper methods for bidirectional synchronization
    public void addProduct(Product product) {
        products.add(product);
        product.setCategory(this);
    }

    public void removeProduct(Product product) {
        products.remove(product);
        product.setCategory(null);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}

