package com.turkcell.product.service.domain.port.usecase;

import com.turkcell.product.service.domain.model.Product;

/**
 * Use case port for creating a new product.
 * This interface defines the contract for the create product operation.
 */
public interface CreateProductUseCase {
    
    /**
     * Creates a new product in the system.
     * 
     * @param product the product to create
     * @return the created product with generated ID and timestamps
     * @throws com.turkcell.product.service.domain.exception.ConflictException if a product with the same name already exists
     * @throws IllegalArgumentException if the product data is invalid
     */
    Product createProduct(Product product);
}
