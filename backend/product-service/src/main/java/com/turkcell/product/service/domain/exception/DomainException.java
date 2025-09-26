package com.turkcell.product.service.domain.exception;

/**
 * Base exception for all domain-related exceptions.
 * This is the root exception class for the domain layer.
 */
public class DomainException extends RuntimeException {
    
    /**
     * Constructs a new domain exception with the specified detail message.
     * 
     * @param message the detail message
     */
    public DomainException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new domain exception with the specified detail message and cause.
     * 
     * @param message the detail message
     * @param cause the cause
     */
    public DomainException(String message, Throwable cause) {
        super(message, cause);
    }
    
    /**
     * Constructs a new domain exception with the specified cause.
     * 
     * @param cause the cause
     */
    public DomainException(Throwable cause) {
        super(cause);
    }
}
