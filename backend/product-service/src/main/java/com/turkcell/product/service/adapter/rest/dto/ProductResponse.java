package com.turkcell.product.service.adapter.rest.dto;

import com.turkcell.product.service.domain.model.ProductStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO for product response.
 * Contains all product information for API responses.
 */
@Schema(description = "Product response containing complete product information")
public record ProductResponse(
    
    @Schema(description = "Product unique identifier", example = "123e4567-e89b-12d3-a456-426614174000")
    String id,
    
    @Schema(description = "Product name", example = "iPhone 15 Pro")
    String name,
    
    @Schema(description = "Product description", example = "Latest iPhone with advanced camera system")
    String description,
    
    @Schema(description = "Product price amount", example = "29999.99")
    BigDecimal priceAmount,
    
    @Schema(description = "Price currency code", example = "TRY")
    String priceCurrency,
    
    @Schema(description = "Formatted price display", example = "29999.99 TRY")
    String priceDisplay,
    
    @Schema(description = "Stock quantity", example = "100")
    Integer stockQuantity,
    
    @Schema(description = "Product status", example = "ACTIVE")
    ProductStatus status,
    
    @Schema(description = "Product availability status", example = "true")
    Boolean available,
    
    @Schema(description = "Creation timestamp", example = "2023-12-01T10:00:00Z")
    Instant createdAt,
    
    @Schema(description = "Last update timestamp", example = "2023-12-01T15:30:00Z")
    Instant updatedAt,
    
    @Schema(description = "Version for optimistic locking", example = "1")
    Long version
) {
    
    /**
     * Constructor with derived fields calculation.
     * Automatically calculates priceDisplay and available status.
     */
    public ProductResponse {
        // Calculate price display
        if (priceAmount != null && priceCurrency != null) {
            priceDisplay = String.format("%.2f %s", priceAmount, priceCurrency);
        } else {
            priceDisplay = "N/A";
        }
        
        // Calculate availability
        available = status == ProductStatus.ACTIVE && stockQuantity != null && stockQuantity > 0;
    }
    
    /**
     * Convenience constructor without derived fields.
     * Automatically calculates priceDisplay and available.
     */
    public ProductResponse(String id, String name, String description, BigDecimal priceAmount, 
                          String priceCurrency, Integer stockQuantity, ProductStatus status, 
                          Instant createdAt, Instant updatedAt, Long version) {
        this(id, name, description, priceAmount, priceCurrency, null, stockQuantity, 
             status, null, createdAt, updatedAt, version);
    }
    
    /**
     * Checks if the product is out of stock.
     * 
     * @return true if stock quantity is zero
     */
    public boolean isOutOfStock() {
        return stockQuantity != null && stockQuantity == 0;
    }
    
    /**
     * Checks if the product is low in stock (less than 10 items).
     * 
     * @return true if stock quantity is less than 10
     */
    public boolean isLowStock() {
        return stockQuantity != null && stockQuantity > 0 && stockQuantity < 10;
    }
    
    /**
     * Gets a short display string for the product.
     * 
     * @return formatted string with name and price
     */
    public String getDisplayName() {
        return String.format("%s (%s)", name, priceDisplay);
    }
}
