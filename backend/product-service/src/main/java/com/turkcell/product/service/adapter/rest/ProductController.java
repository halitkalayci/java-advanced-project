package com.turkcell.product.service.adapter.rest;

import com.turkcell.product.service.domain.model.Product;
import com.turkcell.product.service.domain.model.ProductId;
import com.turkcell.product.service.domain.port.usecase.*;
import com.turkcell.product.service.adapter.error.ApiError;
import com.turkcell.product.service.adapter.rest.dto.CreateProductRequest;
import com.turkcell.product.service.adapter.rest.dto.ProductResponse;
import com.turkcell.product.service.adapter.rest.dto.UpdateProductRequest;
import com.turkcell.product.service.adapter.rest.mapper.ProductMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

/**
 * REST Controller for Product CRUD operations.
 * Provides comprehensive product management API endpoints.
 */
@RestController
@RequestMapping("/api/v1/products")
@Validated
@Tag(name = "Products", description = "Product management API")
public class ProductController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    private final CreateProductUseCase createProductUseCase;
    private final UpdateProductUseCase updateProductUseCase;
    private final DeleteProductUseCase deleteProductUseCase;
    private final GetProductByIdQuery getProductByIdQuery;
    private final ListProductsQuery listProductsQuery;
    private final ProductMapper productMapper;
    
    public ProductController(
            CreateProductUseCase createProductUseCase,
            UpdateProductUseCase updateProductUseCase,
            DeleteProductUseCase deleteProductUseCase,
            GetProductByIdQuery getProductByIdQuery,
            ListProductsQuery listProductsQuery,
            ProductMapper productMapper) {
        this.createProductUseCase = createProductUseCase;
        this.updateProductUseCase = updateProductUseCase;
        this.deleteProductUseCase = deleteProductUseCase;
        this.getProductByIdQuery = getProductByIdQuery;
        this.listProductsQuery = listProductsQuery;
        this.productMapper = productMapper;
    }
    
    /**
     * Creates a new product.
     */
    @PostMapping
    @Operation(summary = "Create a new product", description = "Creates a new product in the catalog")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Product created successfully",
                    content = @Content(schema = @Schema(implementation = ProductResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
        @ApiResponse(responseCode = "409", description = "Product with same name already exists",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request) {
        
        logger.info("Creating new product: {}", request.name());
        
        Product product = productMapper.toProduct(request);
        Product createdProduct = createProductUseCase.createProduct(product);
        ProductResponse response = productMapper.toResponse(createdProduct);
        
        URI location = URI.create("/api/v1/products/" + response.id());
        
        logger.info("Successfully created product with ID: {}", response.id());
        return ResponseEntity.created(location).body(response);
    }
    
    /**
     * Retrieves all products with pagination.
     */
    @GetMapping
    @Operation(summary = "List all products", description = "Retrieves a paginated list of all products")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Products retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid pagination parameters",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<Page<ProductResponse>> listProducts(
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Page size", example = "20")
            @RequestParam(defaultValue = "20") int size,
            
            @Parameter(description = "Sort field", example = "name")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            
            @Parameter(description = "Sort direction", example = "desc")
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        logger.debug("Listing products: page={}, size={}, sortBy={}, sortDir={}", 
                    page, size, sortBy, sortDir);
        
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<Product> productPage = listProductsQuery.listProducts(pageable);
        Page<ProductResponse> responsePage = productPage.map(productMapper::toResponse);
        
        logger.debug("Retrieved {} products out of {} total", 
                    responsePage.getNumberOfElements(), responsePage.getTotalElements());
        
        return ResponseEntity.ok(responsePage);
    }
    
    /**
     * Retrieves a specific product by ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieves a specific product by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Product found",
                    content = @Content(schema = @Schema(implementation = ProductResponse.class))),
        @ApiResponse(responseCode = "404", description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
        @ApiResponse(responseCode = "400", description = "Invalid product ID format",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<ProductResponse> getProductById(
            @Parameter(description = "Product ID", example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String id) {
        
        logger.debug("Getting product by ID: {}", id);
        
        ProductId productId = ProductId.fromString(id);
        Product product = getProductByIdQuery.getProductById(productId);
        ProductResponse response = productMapper.toResponse(product);
        
        logger.debug("Found product: {}", product.getName());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Updates an existing product.
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update product", description = "Updates an existing product")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Product updated successfully",
                    content = @Content(schema = @Schema(implementation = ProductResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
        @ApiResponse(responseCode = "404", description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
        @ApiResponse(responseCode = "409", description = "Conflict (name duplicate or version mismatch)",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<ProductResponse> updateProduct(
            @Parameter(description = "Product ID", example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String id,
            
            @Valid @RequestBody UpdateProductRequest request) {
        
        logger.info("Updating product with ID: {}", id);
        
        // Validate that at least one field is provided for update
        if (!request.hasUpdates()) {
            throw new IllegalArgumentException("At least one field must be provided for update");
        }
        
        ProductId productId = ProductId.fromString(id);
        
        // Get existing product to merge with update data
        Product existingProduct = getProductByIdQuery.getProductById(productId);
        Product productToUpdate = productMapper.toProductForUpdate(request, existingProduct);
        
        Product updatedProduct = updateProductUseCase.updateProduct(productId, productToUpdate);
        ProductResponse response = productMapper.toResponse(updatedProduct);
        
        logger.info("Successfully updated product with ID: {}", id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Deletes a product.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product", description = "Deletes a product from the catalog")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
        @ApiResponse(responseCode = "400", description = "Invalid product ID format",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "Product ID", example = "123e4567-e89b-12d3-a456-426614174000")
            @PathVariable String id) {
        
        logger.info("Deleting product with ID: {}", id);
        
        ProductId productId = ProductId.fromString(id);
        deleteProductUseCase.deleteProduct(productId);
        
        logger.info("Successfully deleted product with ID: {}", id);
        return ResponseEntity.noContent().build();
    }
}
