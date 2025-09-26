package com.turkcell.product.service.domain.model;

import java.util.UUID;

/**
 * Value Object representing a Product identifier.
 * 
 * @param value The UUID value for the product ID
 */
public record ProductId(UUID value) {
    
    public ProductId {
        if (value == null) {
            throw new IllegalArgumentException("ProductId value cannot be null");
        }
    }
    
    /**
     * Creates a new ProductId with a random UUID.
     * 
     * @return A new ProductId instance
     */
    public static ProductId generate() {
        return new ProductId(UUID.randomUUID());
    }
    
    /**
     * Creates a ProductId from a string representation.
     * 
     * @param id The string representation of the UUID
     * @return A new ProductId instance
     * @throws IllegalArgumentException if the string is not a valid UUID
     */
    public static ProductId fromString(String id) {
        try {
            return new ProductId(UUID.fromString(id));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid ProductId format: " + id, e);
        }
    }
    
    @Override
    public String toString() {
        return value.toString();
    }
}
