package com.turkcell.product.service.infrastructure.persistence.repository;

import com.turkcell.product.service.domain.model.Product;
import com.turkcell.product.service.domain.model.ProductId;
import com.turkcell.product.service.domain.port.repository.ProductRepositoryPort;
import com.turkcell.product.service.infrastructure.persistence.entity.ProductEntity;
import com.turkcell.product.service.infrastructure.persistence.mapper.ProductPersistenceMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Adapter implementation of ProductRepositoryPort using Spring Data JPA.
 * This class bridges the domain layer with the persistence infrastructure.
 */
@Component
public class ProductRepositoryAdapter implements ProductRepositoryPort {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductRepositoryAdapter.class);
    
    private final SpringDataProductRepository springDataRepository;
    private final ProductPersistenceMapper mapper;
    
    public ProductRepositoryAdapter(SpringDataProductRepository springDataRepository, 
                                   ProductPersistenceMapper mapper) {
        this.springDataRepository = springDataRepository;
        this.mapper = mapper;
    }
    
    @Override
    public Product save(Product product) {
        logger.debug("Saving product with ID: {}", product.getId());
        
        try {
            ProductEntity entity;
            
            if (existsById(product.getId())) {
                // Update existing entity
                entity = springDataRepository.findById(product.getId().value())
                    .orElseThrow(() -> new IllegalStateException("Product entity not found during update"));
                mapper.updateEntity(product, entity);
            } else {
                // Create new entity
                entity = mapper.toEntity(product);
            }
            
            ProductEntity savedEntity = springDataRepository.save(entity);
            Product savedProduct = mapper.toDomain(savedEntity);
            
            logger.debug("Successfully saved product with ID: {}", savedProduct.getId());
            return savedProduct;
            
        } catch (Exception e) {
            logger.error("Failed to save product with ID: {}", product.getId(), e);
            throw new RuntimeException("Failed to save product", e);
        }
    }
    
    @Override
    public Optional<Product> findById(ProductId id) {
        logger.debug("Finding product by ID: {}", id);
        
        try {
            Optional<ProductEntity> entityOpt = springDataRepository.findById(id.value());
            
            if (entityOpt.isPresent()) {
                Product product = mapper.toDomain(entityOpt.get());
                logger.debug("Found product with ID: {}", id);
                return Optional.of(product);
            } else {
                logger.debug("Product not found with ID: {}", id);
                return Optional.empty();
            }
            
        } catch (Exception e) {
            logger.error("Failed to find product by ID: {}", id, e);
            throw new RuntimeException("Failed to find product", e);
        }
    }
    
    @Override
    public Page<Product> findAll(Pageable pageable) {
        logger.debug("Finding all products with pagination: page={}, size={}", 
                    pageable.getPageNumber(), pageable.getPageSize());
        
        try {
            Page<ProductEntity> entityPage = springDataRepository.findAll(pageable);
            Page<Product> productPage = entityPage.map(mapper::toDomain);
            
            logger.debug("Found {} products out of {} total", 
                        productPage.getNumberOfElements(), productPage.getTotalElements());
            return productPage;
            
        } catch (Exception e) {
            logger.error("Failed to find products with pagination", e);
            throw new RuntimeException("Failed to find products", e);
        }
    }
    
    @Override
    public void deleteById(ProductId id) {
        logger.debug("Deleting product by ID: {}", id);
        
        try {
            springDataRepository.deleteById(id.value());
            logger.debug("Successfully deleted product with ID: {}", id);
            
        } catch (Exception e) {
            logger.error("Failed to delete product by ID: {}", id, e);
            throw new RuntimeException("Failed to delete product", e);
        }
    }
    
    @Override
    public boolean existsByName(String name) {
        logger.debug("Checking if product exists by name: {}", name);
        
        try {
            boolean exists = springDataRepository.existsByName(name);
            logger.debug("Product exists by name '{}': {}", name, exists);
            return exists;
            
        } catch (Exception e) {
            logger.error("Failed to check if product exists by name: {}", name, e);
            throw new RuntimeException("Failed to check product existence", e);
        }
    }
    
    @Override
    public boolean existsByNameAndIdNot(String name, ProductId excludeId) {
        logger.debug("Checking if product exists by name '{}' excluding ID: {}", name, excludeId);
        
        try {
            boolean exists = springDataRepository.existsByNameAndIdNot(name, excludeId.value());
            logger.debug("Product exists by name '{}' excluding ID {}: {}", name, excludeId, exists);
            return exists;
            
        } catch (Exception e) {
            logger.error("Failed to check if product exists by name '{}' excluding ID: {}", name, excludeId, e);
            throw new RuntimeException("Failed to check product existence", e);
        }
    }
    
    @Override
    public boolean existsById(ProductId id) {
        logger.debug("Checking if product exists by ID: {}", id);
        
        try {
            boolean exists = springDataRepository.existsById(id.value());
            logger.debug("Product exists by ID {}: {}", id, exists);
            return exists;
            
        } catch (Exception e) {
            logger.error("Failed to check if product exists by ID: {}", id, e);
            throw new RuntimeException("Failed to check product existence", e);
        }
    }
    
    @Override
    public long count() {
        logger.debug("Counting total products");
        
        try {
            long count = springDataRepository.count();
            logger.debug("Total product count: {}", count);
            return count;
            
        } catch (Exception e) {
            logger.error("Failed to count products", e);
            throw new RuntimeException("Failed to count products", e);
        }
    }
}
