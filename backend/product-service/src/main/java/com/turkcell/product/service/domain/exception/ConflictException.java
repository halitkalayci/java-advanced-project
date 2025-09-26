package com.turkcell.product.service.domain.exception;

/**
 * Exception thrown when there is a conflict in the domain operation.
 * This typically occurs during business rule violations such as duplicate names,
 * optimistic locking failures, or other constraint violations.
 */
public class ConflictException extends DomainException {
    
    /**
     * Constructs a new conflict exception with the specified detail message.
     * 
     * @param message the detail message
     */
    public ConflictException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new conflict exception with the specified detail message and cause.
     * 
     * @param message the detail message
     * @param cause the cause
     */
    public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }
    
    /**
     * Constructs a new conflict exception for duplicate resource.
     * 
     * @param resourceType the type of resource that has a conflict
     * @param field the field that has the conflict
     * @param value the conflicting value
     */
    public static ConflictException duplicate(String resourceType, String field, Object value) {
        return new ConflictException(
            String.format("%s with %s '%s' already exists", resourceType, field, value)
        );
    }
    
    /**
     * Constructs a new conflict exception for version mismatch.
     * 
     * @param resourceType the type of resource that has a version conflict
     * @param id the ID of the resource
     * @return a new ConflictException instance
     */
    public static ConflictException versionMismatch(String resourceType, Object id) {
        return new ConflictException(
            String.format("%s with id '%s' has been modified by another user. Please refresh and try again.", 
                         resourceType, id)
        );
    }
}
