package com.turkcell.product.service.infrastructure.persistence.entity;

import com.turkcell.product.service.domain.model.ProductStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * JPA Entity representing a Product in the database.
 * This entity maps to the 'products' table and includes auditing capabilities.
 */
@Entity
@Table(
    name = "products",
    uniqueConstraints = @UniqueConstraint(name = "uk_products_name", columnNames = "name")
)
@Check(constraints = "price_amount >= 0 AND stock_quantity >= 0")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductEntity {
    
    @Id
    private UUID id;
    
    @Column(nullable = false, length = 128)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(name = "price_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal priceAmount;
    
    @Column(name = "price_currency", nullable = false, length = 3)
    private String priceCurrency;
    
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductStatus status;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    @Version
    private Long version;
    
    /**
     * Constructor for creating a new ProductEntity with ID.
     */
    public ProductEntity(UUID id, String name, String description, BigDecimal priceAmount, 
                        String priceCurrency, Integer stockQuantity, ProductStatus status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.priceAmount = priceAmount;
        this.priceCurrency = priceCurrency;
        this.stockQuantity = stockQuantity;
        this.status = status;
    }
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (updatedAt == null) {
            updatedAt = Instant.now();
        }
        if (status == null) {
            status = ProductStatus.ACTIVE;
        }
        if (priceCurrency == null || priceCurrency.trim().isEmpty()) {
            priceCurrency = "TRY";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        ProductEntity that = (ProductEntity) o;
        return id != null && id.equals(that.id);
    }
    
    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
    
    @Override
    public String toString() {
        return String.format("ProductEntity{id=%s, name='%s', priceAmount=%s, status=%s}", 
                           id, name, priceAmount, status);
    }
}
