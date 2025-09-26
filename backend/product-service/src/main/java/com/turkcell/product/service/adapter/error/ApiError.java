package com.turkcell.product.service.adapter.error;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Standardized API error response structure.
 * Provides consistent error information across all API endpoints.
 */
@Schema(description = "Standard API error response")
public record ApiError(
    
    @Schema(description = "HTTP status code", example = "400")
    int status,
    
    @Schema(description = "Error code identifier", example = "VALIDATION_FAILED")
    String code,
    
    @Schema(description = "Human-readable error message", example = "Validation failed for one or more fields")
    String message,
    
    @Schema(description = "Detailed error description", example = "The request contains invalid data")
    String details,
    
    @Schema(description = "Request path where error occurred", example = "/api/v1/products")
    String path,
    
    @Schema(description = "Error timestamp", example = "2023-12-01T10:00:00Z")
    Instant timestamp,
    
    @Schema(description = "Field-specific validation errors")
    Map<String, List<String>> fieldErrors,
    
    @Schema(description = "Trace ID for debugging", example = "abc123-def456-ghi789")
    String traceId
) {
    
    /**
     * Creates a simple API error without field errors.
     */
    public static ApiError of(int status, String code, String message, String path) {
        return new ApiError(
            status, 
            code, 
            message, 
            null, 
            path, 
            Instant.now(), 
            null, 
            null
        );
    }
    
    /**
     * Creates an API error with details.
     */
    public static ApiError of(int status, String code, String message, String details, String path) {
        return new ApiError(
            status, 
            code, 
            message, 
            details, 
            path, 
            Instant.now(), 
            null, 
            null
        );
    }
    
    /**
     * Creates an API error with field validation errors.
     */
    public static ApiError withFieldErrors(int status, String code, String message, String path, 
                                         Map<String, List<String>> fieldErrors) {
        return new ApiError(
            status, 
            code, 
            message, 
            null, 
            path, 
            Instant.now(), 
            fieldErrors, 
            null
        );
    }
    
    /**
     * Creates an API error with trace ID for debugging.
     */
    public static ApiError withTrace(int status, String code, String message, String path, String traceId) {
        return new ApiError(
            status, 
            code, 
            message, 
            null, 
            path, 
            Instant.now(), 
            null, 
            traceId
        );
    }
    
    /**
     * Adds a trace ID to this error.
     */
    public ApiError withTraceId(String traceId) {
        return new ApiError(
            status, 
            code, 
            message, 
            details, 
            path, 
            timestamp, 
            fieldErrors, 
            traceId
        );
    }
    
    /**
     * Checks if this error has field validation errors.
     */
    public boolean hasFieldErrors() {
        return fieldErrors != null && !fieldErrors.isEmpty();
    }
    
    /**
     * Gets the total number of field errors.
     */
    public int getFieldErrorCount() {
        if (fieldErrors == null) {
            return 0;
        }
        return fieldErrors.values().stream()
                .mapToInt(List::size)
                .sum();
    }
}
