package com.grocery.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * ============================================================================
 * JAKARTA EE REVISION POINT: @Enumerated, @ManyToOne, @JoinColumn, & Constraints
 * ============================================================================
 * 1. @Enumerated(EnumType.STRING):
 *    - Persists the enum constant name as VARCHAR instead of ORDINAL (integer index).
 *    - Best practice: Prevents silent data corruption if enum constants are reordered.
 *
 * 2. @ManyToOne:
 *    - Defines many-to-one association with Category. This is the OWNING side of
 *      the relationship, holding the foreign key column.
 *
 * 3. @JoinColumn:
 *    - Specifies the foreign key column name in MS SQL Server ('category_id').
 *    - 'nullable = false' enforces foreign key constraint at DB schema level.
 *
 * 4. Precision & Scale for Money:
 *    - Monetary fields should ALWAYS use BigDecimal with @Column(precision = 10, scale = 2)
 *      to avoid floating-point rounding errors in transactions.
 * ============================================================================
 */
@Entity
@Table(
    name = "products",
    indexes = {
        @Index(name = "idx_product_name", columnList = "name"),
        @Index(name = "idx_product_category", columnList = "category_id")
    }
)
public class Product extends BaseEntity {

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 120, message = "Product name must be between 2 and 120 characters")
    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @PositiveOrZero(message = "Stock quantity cannot be negative")
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @NotNull(message = "Product unit is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "unit", nullable = false, length = 20)
    private ProductUnit unit;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_organic")
    private Boolean organic = false;

    @NotNull(message = "Category is mandatory")
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(
        name = "category_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_product_category")
    )
    @JsonIgnoreProperties("products")
    private Category category;

    public Product() {
    }

    public Product(String name, String description, BigDecimal price, Integer stockQuantity,
                   ProductUnit unit, String imageUrl, Boolean organic, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.unit = unit;
        this.imageUrl = imageUrl;
        this.organic = organic;
        this.category = category;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public ProductUnit getUnit() {
        return unit;
    }

    public void setUnit(ProductUnit unit) {
        this.unit = unit;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getOrganic() {
        return organic;
    }

    public void setOrganic(Boolean organic) {
        this.organic = organic;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}

