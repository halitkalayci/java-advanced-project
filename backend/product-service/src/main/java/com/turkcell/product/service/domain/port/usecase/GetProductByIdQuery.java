package com.turkcell.product.service.domain.port.usecase;

import com.turkcell.product.service.domain.model.Product;
import com.turkcell.product.service.domain.model.ProductId;

/**
 * Query port for retrieving a product by its ID.
 * This interface defines the contract for the get product by ID operation.
 */
public interface GetProductByIdQuery {
    
    /**
     * Retrieves a product by its ID.
     * 
     * @param id the product ID
     * @return the product
     * @throws com.turkcell.product.service.domain.exception.ResourceNotFoundException if the product is not found
     */
    Product getProductById(ProductId id);
}
