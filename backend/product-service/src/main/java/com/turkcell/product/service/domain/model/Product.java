package com.turkcell.product.service.domain.model;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Product Aggregate Root representing a product in the catalog.
 * This is the main domain entity that encapsulates all business rules for products.
 */
public class Product {
    
    private final ProductId id;
    private String name;
    private String description;
    private Money price;
    private int stockQuantity;
    private ProductStatus status;
    private final Instant createdAt;
    private Instant updatedAt;
    private long version;
    
    /**
     * Constructor for creating a new Product.
     * 
     * @param id The product identifier
     * @param name The product name
     * @param description The product description
     * @param price The product price
     * @param stockQuantity The stock quantity
     * @param status The product status
     * @param createdAt The creation timestamp
     * @param updatedAt The last update timestamp
     * @param version The version for optimistic locking
     */
    public Product(ProductId id, String name, String description, Money price, 
                   int stockQuantity, ProductStatus status, Instant createdAt, 
                   Instant updatedAt, long version) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.status = status != null ? status : ProductStatus.getDefault();
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
        this.version = version;
        
        validate();
    }
    
    /**
     * Factory method for creating a new Product with generated ID and timestamps.
     * 
     * @param name The product name
     * @param description The product description
     * @param price The product price
     * @param stockQuantity The stock quantity
     * @return A new Product instance
     */
    public static Product create(String name, String description, Money price, int stockQuantity) {
        return new Product(
            ProductId.generate(),
            name,
            description,
            price,
            stockQuantity,
            ProductStatus.getDefault(),
            Instant.now(),
            Instant.now(),
            0L
        );
    }
    
    /**
     * Factory method for creating a Product with specific status.
     * 
     * @param name The product name
     * @param description The product description
     * @param price The product price
     * @param stockQuantity The stock quantity
     * @param status The product status
     * @return A new Product instance
     */
    public static Product create(String name, String description, Money price, 
                                int stockQuantity, ProductStatus status) {
        return new Product(
            ProductId.generate(),
            name,
            description,
            price,
            stockQuantity,
            status,
            Instant.now(),
            Instant.now(),
            0L
        );
    }
    
    /**
     * Updates the product information.
     * 
     * @param name The new product name
     * @param description The new product description
     * @param price The new product price
     * @param stockQuantity The new stock quantity
     * @param status The new product status
     */
    public void update(String name, String description, Money price, 
                      int stockQuantity, ProductStatus status) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.status = status != null ? status : this.status;
        this.updatedAt = Instant.now();
        
        validate();
    }
    
    /**
     * Updates the stock quantity.
     * 
     * @param stockQuantity The new stock quantity
     */
    public void updateStock(int stockQuantity) {
        this.stockQuantity = stockQuantity;
        this.updatedAt = Instant.now();
        validateStockQuantity();
    }
    
    /**
     * Activates the product.
     */
    public void activate() {
        this.status = ProductStatus.ACTIVE;
        this.updatedAt = Instant.now();
    }
    
    /**
     * Deactivates the product.
     */
    public void deactivate() {
        this.status = ProductStatus.INACTIVE;
        this.updatedAt = Instant.now();
    }
    
    /**
     * Checks if the product is available for purchase.
     * 
     * @return true if product is active and has stock
     */
    public boolean isAvailable() {
        return status.isActive() && stockQuantity > 0;
    }
    
    /**
     * Checks if the product is out of stock.
     * 
     * @return true if stock quantity is zero
     */
    public boolean isOutOfStock() {
        return stockQuantity == 0;
    }
    
    /**
     * Validates all product business rules.
     * 
     * @throws IllegalArgumentException if any validation rule fails
     */
    private void validate() {
        validateName();
        validateDescription();
        validatePrice();
        validateStockQuantity();
    }
    
    /**
     * Validates the product name.
     * 
     * @throws IllegalArgumentException if name is invalid
     */
    private void validateName() {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be null or empty");
        }
        
        String trimmedName = name.trim();
        if (trimmedName.length() < 2) {
            throw new IllegalArgumentException("Product name must be at least 2 characters long");
        }
        
        if (trimmedName.length() > 128) {
            throw new IllegalArgumentException("Product name cannot exceed 128 characters");
        }
    }
    
    /**
     * Validates the product description.
     * 
     * @throws IllegalArgumentException if description is invalid
     */
    private void validateDescription() {
        if (description != null && description.trim().length() > 1000) {
            throw new IllegalArgumentException("Product description cannot exceed 1000 characters");
        }
    }
    
    /**
     * Validates the product price.
     * 
     * @throws IllegalArgumentException if price is invalid
     */
    private void validatePrice() {
        if (price == null) {
            throw new IllegalArgumentException("Product price cannot be null");
        }
        
        if (price.amount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Product price must be non-negative");
        }
    }
    
    /**
     * Validates the stock quantity.
     * 
     * @throws IllegalArgumentException if stock quantity is invalid
     */
    private void validateStockQuantity() {
        if (stockQuantity < 0) {
            throw new IllegalArgumentException("Stock quantity must be non-negative");
        }
    }
    
    // Getters
    public ProductId getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public Money getPrice() {
        return price;
    }
    
    public int getStockQuantity() {
        return stockQuantity;
    }
    
    public ProductStatus getStatus() {
        return status;
    }
    
    public Instant getCreatedAt() {
        return createdAt;
    }
    
    public Instant getUpdatedAt() {
        return updatedAt;
    }
    
    public long getVersion() {
        return version;
    }
    
    // Package-private setters for infrastructure layer
    void setVersion(long version) {
        this.version = version;
    }
    
    void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        Product product = (Product) o;
        return id.equals(product.id);
    }
    
    @Override
    public int hashCode() {
        return id.hashCode();
    }
    
    @Override
    public String toString() {
        return String.format("Product{id=%s, name='%s', price=%s, status=%s}", 
                           id, name, price, status);
    }
}
