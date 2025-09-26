package com.turkcell.product.service.adapter.rest.dto;

import com.turkcell.product.service.domain.model.ProductStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

/**
 * DTO for updating an existing product.
 * All fields are optional to support partial updates.
 * Contains validation rules and OpenAPI documentation.
 */
@Schema(description = "Request for updating an existing product")
public record UpdateProductRequest(
    
    @Schema(description = "Product name", example = "iPhone 15 Pro Max", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @Size(min = 2, max = 128, message = "Product name must be between 2 and 128 characters")
    String name,
    
    @Schema(description = "Product description", example = "Updated iPhone with enhanced features", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @Size(max = 1000, message = "Product description cannot exceed 1000 characters")
    String description,
    
    @Schema(description = "Product price amount", example = "32999.99", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @DecimalMin(value = "0.0", inclusive = true, message = "Price amount must be non-negative")
    @Digits(integer = 10, fraction = 2, message = "Price amount must have at most 10 integer digits and 2 fractional digits")
    BigDecimal priceAmount,
    
    @Schema(description = "Price currency code", example = "USD", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @Size(min = 3, max = 3, message = "Currency code must be exactly 3 characters")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency code must be 3 uppercase letters")
    String priceCurrency,
    
    @Schema(description = "Stock quantity", example = "150", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @Min(value = 0, message = "Stock quantity must be non-negative")
    Integer stockQuantity,
    
    @Schema(description = "Product status", example = "INACTIVE", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    ProductStatus status,
    
    @Schema(description = "Version for optimistic locking", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Version is required for optimistic locking")
    @Min(value = 0, message = "Version must be non-negative")
    Long version
) {
    
    /**
     * Constructor with input normalization.
     * Normalizes currency code to uppercase if provided.
     */
    public UpdateProductRequest {
        if (priceCurrency != null && !priceCurrency.trim().isEmpty()) {
            priceCurrency = priceCurrency.trim().toUpperCase();
        }
    }
    
    /**
     * Checks if the request has any fields to update (excluding version).
     * 
     * @return true if at least one field is provided for update
     */
    public boolean hasUpdates() {
        return name != null || 
               description != null || 
               priceAmount != null || 
               priceCurrency != null || 
               stockQuantity != null || 
               status != null;
    }
    
    /**
     * Checks if both price amount and currency are provided together.
     * This is useful for validation when updating price information.
     * 
     * @return true if both price fields are provided or both are null
     */
    public boolean isPriceUpdateValid() {
        return (priceAmount != null && priceCurrency != null) || 
               (priceAmount == null && priceCurrency == null);
    }
}
