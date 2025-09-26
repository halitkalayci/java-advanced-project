package com.turkcell.product.service.domain.exception;

/**
 * Exception thrown when a requested resource is not found.
 * This exception indicates that a domain entity could not be located.
 */
public class ResourceNotFoundException extends DomainException {
    
    /**
     * Constructs a new resource not found exception with the specified detail message.
     * 
     * @param message the detail message
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new resource not found exception with the specified detail message and cause.
     * 
     * @param message the detail message
     * @param cause the cause
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    /**
     * Constructs a new resource not found exception for a specific entity type and ID.
     * 
     * @param entityType the type of entity that was not found
     * @param id the ID of the entity that was not found
     */
    public ResourceNotFoundException(String entityType, Object id) {
        super(String.format("%s with id '%s' not found", entityType, id));
    }
}
