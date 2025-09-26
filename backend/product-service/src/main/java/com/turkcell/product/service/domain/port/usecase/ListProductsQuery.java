package com.turkcell.product.service.domain.port.usecase;

import com.turkcell.product.service.domain.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Query port for listing products with pagination.
 * This interface defines the contract for the list products operation.
 */
public interface ListProductsQuery {
    
    /**
     * Retrieves a paginated list of products.
     * 
     * @param pageable the pagination information (page, size, sort)
     * @return a page of products
     */
    Page<Product> listProducts(Pageable pageable);
}
