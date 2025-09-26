package com.turkcell.product.service.adapter.error;

import com.turkcell.product.service.domain.exception.ConflictException;
import com.turkcell.product.service.domain.exception.DomainException;
import com.turkcell.product.service.domain.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Global exception handler for all REST controllers.
 * Provides consistent error responses across the entire API.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    /**
     * Handles validation errors from request body validation.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationErrors(
            MethodArgumentNotValidException ex, 
            HttpServletRequest request) {
        
        logger.warn("Validation error on path {}: {}", request.getRequestURI(), ex.getMessage());
        
        Map<String, List<String>> fieldErrors = new HashMap<>();
        
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            String fieldName = fieldError.getField();
            String errorMessage = fieldError.getDefaultMessage();
            
            fieldErrors.computeIfAbsent(fieldName, k -> new ArrayList<>()).add(errorMessage);
        }
        
        ApiError apiError = ApiError.withFieldErrors(
            HttpStatus.BAD_REQUEST.value(),
            "VALIDATION_FAILED",
            "Validation failed for one or more fields",
            request.getRequestURI(),
            fieldErrors
        );
        
        return ResponseEntity.badRequest().body(apiError);
    }
    
    /**
     * Handles resource not found exceptions.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(
            ResourceNotFoundException ex, 
            HttpServletRequest request) {
        
        logger.warn("Resource not found on path {}: {}", request.getRequestURI(), ex.getMessage());
        
        ApiError apiError = ApiError.of(
            HttpStatus.NOT_FOUND.value(),
            "RESOURCE_NOT_FOUND",
            ex.getMessage(),
            request.getRequestURI()
        );
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiError);
    }
    
    /**
     * Handles domain conflict exceptions (duplicate names, etc.).
     */
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiError> handleConflict(
            ConflictException ex, 
            HttpServletRequest request) {
        
        logger.warn("Conflict error on path {}: {}", request.getRequestURI(), ex.getMessage());
        
        ApiError apiError = ApiError.of(
            HttpStatus.CONFLICT.value(),
            "CONFLICT",
            ex.getMessage(),
            request.getRequestURI()
        );
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(apiError);
    }
    
    /**
     * Handles optimistic locking failures.
     */
    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<ApiError> handleOptimisticLockingFailure(
            OptimisticLockingFailureException ex, 
            HttpServletRequest request) {
        
        logger.warn("Optimistic locking failure on path {}: {}", request.getRequestURI(), ex.getMessage());
        
        ApiError apiError = ApiError.of(
            HttpStatus.CONFLICT.value(),
            "VERSION_CONFLICT",
            "The resource has been modified by another user. Please refresh and try again.",
            "This typically occurs when multiple users try to update the same resource simultaneously.",
            request.getRequestURI()
        );
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(apiError);
    }
    
    /**
     * Handles illegal argument exceptions (domain validation errors).
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(
            IllegalArgumentException ex, 
            HttpServletRequest request) {
        
        logger.warn("Illegal argument on path {}: {}", request.getRequestURI(), ex.getMessage());
        
        ApiError apiError = ApiError.of(
            HttpStatus.BAD_REQUEST.value(),
            "INVALID_INPUT",
            ex.getMessage(),
            request.getRequestURI()
        );
        
        return ResponseEntity.badRequest().body(apiError);
    }
    
    /**
     * Handles general domain exceptions.
     */
    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ApiError> handleDomainException(
            DomainException ex, 
            HttpServletRequest request) {
        
        logger.warn("Domain exception on path {}: {}", request.getRequestURI(), ex.getMessage());
        
        ApiError apiError = ApiError.of(
            HttpStatus.BAD_REQUEST.value(),
            "DOMAIN_ERROR",
            ex.getMessage(),
            request.getRequestURI()
        );
        
        return ResponseEntity.badRequest().body(apiError);
    }
    
    /**
     * Handles all other runtime exceptions.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRuntimeException(
            RuntimeException ex, 
            HttpServletRequest request) {
        
        logger.error("Unexpected runtime exception on path {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        
        ApiError apiError = ApiError.of(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "INTERNAL_ERROR",
            "An unexpected error occurred. Please try again later.",
            request.getRequestURI()
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiError);
    }
    
    /**
     * Handles all other exceptions.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(
            Exception ex, 
            HttpServletRequest request) {
        
        logger.error("Unexpected exception on path {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        
        ApiError apiError = ApiError.of(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "INTERNAL_ERROR",
            "An unexpected error occurred. Please try again later.",
            request.getRequestURI()
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiError);
    }
}
