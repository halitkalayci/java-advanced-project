package com.turkcell.product.service.domain.port.repository;

import com.turkcell.product.service.domain.model.Product;
import com.turkcell.product.service.domain.model.ProductId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Port interface for Product repository operations.
 * This defines the contract for persistence operations in the domain layer.
 */
public interface ProductRepositoryPort {
    
    /**
     * Saves a product.
     * 
     * @param product the product to save
     * @return the saved product with updated version and timestamps
     */
    Product save(Product product);
    
    /**
     * Finds a product by its ID.
     * 
     * @param id the product ID
     * @return an Optional containing the product if found, empty otherwise
     */
    Optional<Product> findById(ProductId id);
    
    /**
     * Finds all products with pagination.
     * 
     * @param pageable the pagination information
     * @return a page of products
     */
    Page<Product> findAll(Pageable pageable);
    
    /**
     * Deletes a product by its ID.
     * 
     * @param id the product ID to delete
     */
    void deleteById(ProductId id);
    
    /**
     * Checks if a product exists with the given name.
     * 
     * @param name the product name to check
     * @return true if a product with the name exists, false otherwise
     */
    boolean existsByName(String name);
    
    /**
     * Checks if a product exists with the given name excluding a specific ID.
     * This is useful for update operations to check name uniqueness.
     * 
     * @param name the product name to check
     * @param excludeId the product ID to exclude from the check
     * @return true if a product with the name exists (excluding the specified ID), false otherwise
     */
    boolean existsByNameAndIdNot(String name, ProductId excludeId);
    
    /**
     * Checks if a product exists with the given ID.
     * 
     * @param id the product ID to check
     * @return true if a product with the ID exists, false otherwise
     */
    boolean existsById(ProductId id);
    
    /**
     * Counts the total number of products.
     * 
     * @return the total number of products
     */
    long count();
}
