package com.turkcell.product.service.adapter.rest.dto;

import com.turkcell.product.service.domain.model.ProductStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

/**
 * DTO for creating a new product.
 * Contains validation rules and OpenAPI documentation.
 */
@Schema(description = "Request for creating a new product")
public record CreateProductRequest(
    
    @Schema(description = "Product name", example = "iPhone 15 Pro", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 128, message = "Product name must be between 2 and 128 characters")
    String name,
    
    @Schema(description = "Product description", example = "Latest iPhone with advanced camera system", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @Size(max = 1000, message = "Product description cannot exceed 1000 characters")
    String description,
    
    @Schema(description = "Product price amount", example = "29999.99", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Price amount is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price amount must be non-negative")
    @Digits(integer = 10, fraction = 2, message = "Price amount must have at most 10 integer digits and 2 fractional digits")
    BigDecimal priceAmount,
    
    @Schema(description = "Price currency code", example = "TRY", defaultValue = "TRY", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @Size(min = 3, max = 3, message = "Currency code must be exactly 3 characters")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency code must be 3 uppercase letters")
    String priceCurrency,
    
    @Schema(description = "Stock quantity", example = "100", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be non-negative")
    Integer stockQuantity,
    
    @Schema(description = "Product status", example = "ACTIVE", defaultValue = "ACTIVE", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    ProductStatus status
) {
    
    /**
     * Constructor with default values.
     * Sets default currency to TRY and status to ACTIVE if not provided.
     */
    public CreateProductRequest {
        if (priceCurrency == null || priceCurrency.trim().isEmpty()) {
            priceCurrency = "TRY";
        } else {
            priceCurrency = priceCurrency.trim().toUpperCase();
        }
        
        if (status == null) {
            status = ProductStatus.ACTIVE;
        }
    }
    
    /**
     * Convenience constructor without optional fields.
     */
    public CreateProductRequest(String name, String description, BigDecimal priceAmount, Integer stockQuantity) {
        this(name, description, priceAmount, "TRY", stockQuantity, ProductStatus.ACTIVE);
    }
}
