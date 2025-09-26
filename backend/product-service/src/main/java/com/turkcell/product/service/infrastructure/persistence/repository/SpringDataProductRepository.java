package com.turkcell.product.service.infrastructure.persistence.repository;

import com.turkcell.product.service.infrastructure.persistence.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Spring Data JPA repository for ProductEntity.
 * This interface provides basic CRUD operations and custom query methods.
 */
@Repository
public interface SpringDataProductRepository extends JpaRepository<ProductEntity, UUID> {
    
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
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM ProductEntity p WHERE p.name = :name AND p.id != :excludeId")
    boolean existsByNameAndIdNot(@Param("name") String name, @Param("excludeId") UUID excludeId);
}
