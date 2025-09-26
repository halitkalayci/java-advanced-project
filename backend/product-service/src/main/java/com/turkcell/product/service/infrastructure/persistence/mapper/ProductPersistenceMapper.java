package com.turkcell.product.service.infrastructure.persistence.mapper;

import com.turkcell.product.service.domain.model.Money;
import com.turkcell.product.service.domain.model.Product;
import com.turkcell.product.service.domain.model.ProductId;
import com.turkcell.product.service.infrastructure.persistence.entity.ProductEntity;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * MapStruct mapper for converting between Product domain model and ProductEntity.
 */
@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
)
public interface ProductPersistenceMapper {
    
    /**
     * Maps a Product domain model to ProductEntity.
     * 
     * @param product the domain model
     * @return the entity
     */
    @Mapping(target = "id", source = "id", qualifiedByName = "productIdToUUID")
    @Mapping(target = "priceAmount", source = "price", qualifiedByName = "moneyToAmount")
    @Mapping(target = "priceCurrency", source = "price", qualifiedByName = "moneyToCurrency")
    @Mapping(target = "version", ignore = true) // Let Hibernate manage version for new entities
    @Mapping(target = "createdAt", ignore = true) // Let JPA auditing handle these
    @Mapping(target = "updatedAt", ignore = true) // Let JPA auditing handle these
    ProductEntity toEntity(Product product);
    
    /**
     * Maps a ProductEntity to Product domain model.
     * 
     * @param entity the entity
     * @return the domain model
     */
    @Mapping(target = "id", source = "id", qualifiedByName = "uuidToProductId")
    @Mapping(target = "price", source = ".", qualifiedByName = "entityToMoney")
    Product toDomain(ProductEntity entity);
    
    /**
     * Updates an existing ProductEntity with data from Product domain model.
     * 
     * @param product the source domain model
     * @param entity the target entity to update
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "priceAmount", source = "price", qualifiedByName = "moneyToAmount")
    @Mapping(target = "priceCurrency", source = "price", qualifiedByName = "moneyToCurrency")
    void updateEntity(Product product, @MappingTarget ProductEntity entity);
    
    // Named mapping methods for complex conversions
    
    @Named("productIdToUUID")
    default UUID productIdToUUID(ProductId productId) {
        return productId != null ? productId.value() : null;
    }
    
    @Named("uuidToProductId")
    default ProductId uuidToProductId(UUID uuid) {
        return uuid != null ? new ProductId(uuid) : null;
    }
    
    @Named("moneyToAmount")
    default BigDecimal moneyToAmount(Money money) {
        return money != null ? money.amount() : null;
    }
    
    @Named("moneyToCurrency")
    default String moneyToCurrency(Money money) {
        return money != null ? money.currency() : "TRY";
    }
    
    @Named("entityToMoney")
    default Money entityToMoney(ProductEntity entity) {
        if (entity == null || entity.getPriceAmount() == null) {
            return null;
        }
        
        String currency = entity.getPriceCurrency();
        if (currency == null || currency.trim().isEmpty()) {
            currency = "TRY";
        }
        
        return new Money(entity.getPriceAmount(), currency);
    }
}
