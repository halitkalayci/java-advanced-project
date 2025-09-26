package com.turkcell.product.service.adapter.rest.mapper;

import com.turkcell.product.service.domain.model.Money;
import com.turkcell.product.service.domain.model.Product;
import com.turkcell.product.service.domain.model.ProductId;
import com.turkcell.product.service.adapter.rest.dto.CreateProductRequest;
import com.turkcell.product.service.adapter.rest.dto.ProductResponse;
import com.turkcell.product.service.adapter.rest.dto.UpdateProductRequest;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * MapStruct mapper for converting between DTOs and Product domain model.
 */
@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
)
public interface ProductMapper {
    
    /**
     * Maps CreateProductRequest to Product domain model.
     * 
     * @param request the create request DTO
     * @return a new Product instance
     */
    default Product toProduct(CreateProductRequest request) {
        Money price = createRequestToMoney(request);
        return Product.create(
            request.name(),
            request.description(),
            price,
            request.stockQuantity(),
            request.status()
        );
    }
    
    /**
     * Maps UpdateProductRequest to Product domain model.
     * This is used for partial updates, where only provided fields are mapped.
     * 
     * @param request the update request DTO
     * @param existingProduct the existing product to update
     * @return an updated Product instance
     */
    @Mapping(target = "id", source = "existingProduct.id")
    @Mapping(target = "name", source = "request.name", conditionExpression = "java(request.name() != null)")
    @Mapping(target = "description", source = "request.description", conditionExpression = "java(request.description() != null)")
    @Mapping(target = "price", expression = "java(updateRequestToMoney(request, existingProduct))")
    @Mapping(target = "stockQuantity", source = "request.stockQuantity", conditionExpression = "java(request.stockQuantity() != null)")
    @Mapping(target = "status", source = "request.status", conditionExpression = "java(request.status() != null)")
    @Mapping(target = "createdAt", source = "existingProduct.createdAt")
    @Mapping(target = "updatedAt", expression = "java(java.time.Instant.now())")
    @Mapping(target = "version", source = "request.version")
    Product toProductForUpdate(UpdateProductRequest request, Product existingProduct);
    
    /**
     * Maps Product domain model to ProductResponse DTO.
     * 
     * @param product the domain model
     * @return the response DTO
     */
    @Mapping(target = "id", source = "id", qualifiedByName = "productIdToString")
    @Mapping(target = "priceAmount", source = "price.amount")
    @Mapping(target = "priceCurrency", source = "price.currency")
    @Mapping(target = "priceDisplay", ignore = true)
    @Mapping(target = "available", ignore = true)
    ProductResponse toResponse(Product product);
    
    // Named mapping methods for complex conversions
    
    @Named("createRequestToMoney")
    default Money createRequestToMoney(CreateProductRequest request) {
        if (request.priceAmount() == null) {
            return null;
        }
        
        String currency = request.priceCurrency();
        if (currency == null || currency.trim().isEmpty()) {
            currency = "TRY";
        }
        
        return new Money(request.priceAmount(), currency);
    }
    
    @Named("updateRequestToMoney")
    default Money updateRequestToMoney(UpdateProductRequest request, Product existingProduct) {
        // If no price fields are provided in the update request, keep existing price
        if (request.priceAmount() == null && request.priceCurrency() == null) {
            return existingProduct.getPrice();
        }
        
        // If both price fields are provided, create new Money
        if (request.priceAmount() != null && request.priceCurrency() != null) {
            return new Money(request.priceAmount(), request.priceCurrency());
        }
        
        // If only amount is provided, use existing currency
        if (request.priceAmount() != null && request.priceCurrency() == null) {
            String existingCurrency = existingProduct.getPrice() != null ? 
                existingProduct.getPrice().currency() : "TRY";
            return new Money(request.priceAmount(), existingCurrency);
        }
        
        // If only currency is provided, use existing amount
        if (request.priceAmount() == null && request.priceCurrency() != null) {
            BigDecimal existingAmount = existingProduct.getPrice() != null ? 
                existingProduct.getPrice().amount() : BigDecimal.ZERO;
            return new Money(existingAmount, request.priceCurrency());
        }
        
        // This should not happen, but return existing as fallback
        return existingProduct.getPrice();
    }
    
    @Named("productIdToString")
    default String productIdToString(ProductId productId) {
        return productId != null ? productId.toString() : null;
    }
}
