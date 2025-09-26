package com.turkcell.product.service.application.service;

import com.turkcell.product.service.domain.exception.ConflictException;
import com.turkcell.product.service.domain.exception.ResourceNotFoundException;
import com.turkcell.product.service.domain.model.Product;
import com.turkcell.product.service.domain.model.ProductId;
import com.turkcell.product.service.domain.port.repository.ProductRepositoryPort;
import com.turkcell.product.service.domain.port.usecase.CreateProductUseCase;
import com.turkcell.product.service.domain.port.usecase.DeleteProductUseCase;
import com.turkcell.product.service.domain.port.usecase.UpdateProductUseCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Application service implementing command use cases for Product aggregate.
 * This service handles all write operations (create, update, delete) with proper transaction boundaries.
 */
@Service
@Transactional
public class ProductCommandService implements CreateProductUseCase, UpdateProductUseCase, DeleteProductUseCase {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductCommandService.class);
    
    private final ProductRepositoryPort productRepository;
    
    public ProductCommandService(ProductRepositoryPort productRepository) {
        this.productRepository = productRepository;
    }
    
    @Override
    public Product createProduct(Product product) {
        logger.info("Creating new product with name: {}", product.getName());
        
        // Check for name uniqueness
        if (productRepository.existsByName(product.getName())) {
            logger.warn("Attempt to create product with duplicate name: {}", product.getName());
            throw ConflictException.duplicate("Product", "name", product.getName());
        }
        
        try {
            Product savedProduct = productRepository.save(product);
            logger.info("Successfully created product with ID: {}", savedProduct.getId());
            return savedProduct;
            
        } catch (Exception e) {
            logger.error("Failed to create product with name: {}", product.getName(), e);
            throw new RuntimeException("Failed to create product", e);
        }
    }
    
    @Override
    public Product updateProduct(ProductId id, Product updatedProduct) {
        logger.info("Updating product with ID: {}", id);
        
        // Find existing product
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Attempt to update non-existent product with ID: {}", id);
                    return new ResourceNotFoundException("Product", id);
                });
        
        // Check for name uniqueness if name is being changed
        if (!existingProduct.getName().equals(updatedProduct.getName()) &&
            productRepository.existsByNameAndIdNot(updatedProduct.getName(), id)) {
            logger.warn("Attempt to update product {} with duplicate name: {}", id, updatedProduct.getName());
            throw ConflictException.duplicate("Product", "name", updatedProduct.getName());
        }
        
        // Check version for optimistic locking
        if (existingProduct.getVersion() != updatedProduct.getVersion()) {
            logger.warn("Version mismatch for product {}: expected {}, got {}", 
                       id, existingProduct.getVersion(), updatedProduct.getVersion());
            throw ConflictException.versionMismatch("Product", id);
        }
        
        try {
            // Update the existing product
            existingProduct.update(
                updatedProduct.getName(),
                updatedProduct.getDescription(),
                updatedProduct.getPrice(),
                updatedProduct.getStockQuantity(),
                updatedProduct.getStatus()
            );
            
            Product savedProduct = productRepository.save(existingProduct);
            logger.info("Successfully updated product with ID: {}", id);
            return savedProduct;
            
        } catch (Exception e) {
            logger.error("Failed to update product with ID: {}", id, e);
            throw new RuntimeException("Failed to update product", e);
        }
    }
    
    @Override
    public void deleteProduct(ProductId id) {
        logger.info("Deleting product with ID: {}", id);
        
        // Check if product exists
        if (!productRepository.existsById(id)) {
            logger.warn("Attempt to delete non-existent product with ID: {}", id);
            throw new ResourceNotFoundException("Product", id);
        }
        
        try {
            productRepository.deleteById(id);
            logger.info("Successfully deleted product with ID: {}", id);
            
        } catch (Exception e) {
            logger.error("Failed to delete product with ID: {}", id, e);
            throw new RuntimeException("Failed to delete product", e);
        }
    }
}
