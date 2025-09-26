package com.turkcell.product.service.domain.port.usecase;

import com.turkcell.product.service.domain.model.ProductId;

/**
 * Use case port for deleting a product.
 * This interface defines the contract for the delete product operation.
 */
public interface DeleteProductUseCase {
    
    /**
     * Deletes a product from the system.
     * 
     * @param id the ID of the product to delete
     * @throws com.turkcell.product.service.domain.exception.ResourceNotFoundException if the product is not found
     */
    void deleteProduct(ProductId id);
}
