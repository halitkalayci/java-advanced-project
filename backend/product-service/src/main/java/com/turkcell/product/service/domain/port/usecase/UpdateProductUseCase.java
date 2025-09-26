package com.turkcell.product.service.domain.port.usecase;

import com.turkcell.product.service.domain.model.Product;
import com.turkcell.product.service.domain.model.ProductId;

/**
 * Use case port for updating an existing product.
 * This interface defines the contract for the update product operation.
 */
public interface UpdateProductUseCase {
    
    /**
     * Updates an existing product in the system.
     * 
     * @param id the ID of the product to update
     * @param product the updated product data
     * @return the updated product
     * @throws com.turkcell.product.service.domain.exception.ResourceNotFoundException if the product is not found
     * @throws com.turkcell.product.service.domain.exception.ConflictException if there's a name conflict or version mismatch
     * @throws IllegalArgumentException if the product data is invalid
     */
    Product updateProduct(ProductId id, Product product);
}
