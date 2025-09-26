package com.turkcell.product.service.application.service;

import com.turkcell.product.service.domain.exception.ResourceNotFoundException;
import com.turkcell.product.service.domain.model.Product;
import com.turkcell.product.service.domain.model.ProductId;
import com.turkcell.product.service.domain.port.repository.ProductRepositoryPort;
import com.turkcell.product.service.domain.port.usecase.GetProductByIdQuery;
import com.turkcell.product.service.domain.port.usecase.ListProductsQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Application service implementing query use cases for Product aggregate.
 * This service handles all read operations with read-only transaction boundaries.
 */
@Service
@Transactional(readOnly = true)
public class ProductQueryService implements GetProductByIdQuery, ListProductsQuery {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductQueryService.class);
    
    private final ProductRepositoryPort productRepository;
    
    public ProductQueryService(ProductRepositoryPort productRepository) {
        this.productRepository = productRepository;
    }
    
    @Override
    public Product getProductById(ProductId id) {
        logger.debug("Retrieving product with ID: {}", id);
        
        return productRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Product not found with ID: {}", id);
                    return new ResourceNotFoundException("Product", id);
                });
    }
    
    @Override
    public Page<Product> listProducts(Pageable pageable) {
        logger.debug("Retrieving products with pagination: page={}, size={}, sort={}", 
                    pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        
        try {
            Page<Product> products = productRepository.findAll(pageable);
            logger.debug("Retrieved {} products out of {} total", 
                        products.getNumberOfElements(), products.getTotalElements());
            return products;
            
        } catch (Exception e) {
            logger.error("Failed to retrieve products with pagination", e);
            throw new RuntimeException("Failed to retrieve products", e);
        }
    }
}
