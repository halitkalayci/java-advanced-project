package com.turkcell.product.service.domain.model;

/**
 * Enum representing the status of a Product.
 */
public enum ProductStatus {
    
    /**
     * Product is active and available for purchase
     */
    ACTIVE,
    
    /**
     * Product is inactive and not available for purchase
     */
    INACTIVE;
    
    /**
     * Returns the default status for new products.
     * 
     * @return The default ProductStatus (ACTIVE)
     */
    public static ProductStatus getDefault() {
        return ACTIVE;
    }
    
    /**
     * Checks if the status is active.
     * 
     * @return true if status is ACTIVE
     */
    public boolean isActive() {
        return this == ACTIVE;
    }
    
    /**
     * Checks if the status is inactive.
     * 
     * @return true if status is INACTIVE
     */
    public boolean isInactive() {
        return this == INACTIVE;
    }
}
