package com.turkcell.product.service.domain.model;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Value Object representing monetary value with currency.
 * 
 * @param amount The monetary amount
 * @param currency The currency code (defaults to TRY if null or empty)
 */
public record Money(BigDecimal amount, String currency) {
    
    private static final String DEFAULT_CURRENCY = "TRY";
    
    public Money {
        if (amount == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Amount must be non-negative, got: " + amount);
        }
        
        // Set default currency if null or empty
        if (currency == null || currency.trim().isEmpty()) {
            currency = DEFAULT_CURRENCY;
        } else {
            currency = currency.trim().toUpperCase();
        }
        
        // Scale amount to 2 decimal places for monetary values
        amount = amount.setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * Creates a Money instance with TRY currency.
     * 
     * @param amount The monetary amount
     * @return A new Money instance with TRY currency
     */
    public static Money of(BigDecimal amount) {
        return new Money(amount, DEFAULT_CURRENCY);
    }
    
    /**
     * Creates a Money instance with specified currency.
     * 
     * @param amount The monetary amount
     * @param currency The currency code
     * @return A new Money instance
     */
    public static Money of(BigDecimal amount, String currency) {
        return new Money(amount, currency);
    }
    
    /**
     * Creates a Money instance from double value with TRY currency.
     * 
     * @param amount The monetary amount as double
     * @return A new Money instance with TRY currency
     */
    public static Money of(double amount) {
        return new Money(BigDecimal.valueOf(amount), DEFAULT_CURRENCY);
    }
    
    /**
     * Adds another Money value to this one.
     * Both Money objects must have the same currency.
     * 
     * @param other The Money to add
     * @return A new Money instance with the sum
     * @throws IllegalArgumentException if currencies don't match
     */
    public Money add(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException(
                String.format("Cannot add different currencies: %s and %s", this.currency, other.currency)
            );
        }
        return new Money(this.amount.add(other.amount), this.currency);
    }
    
    /**
     * Multiplies this Money by a factor.
     * 
     * @param factor The multiplication factor
     * @return A new Money instance with the product
     */
    public Money multiply(BigDecimal factor) {
        if (factor == null) {
            throw new IllegalArgumentException("Factor cannot be null");
        }
        return new Money(this.amount.multiply(factor), this.currency);
    }
    
    /**
     * Checks if this Money is zero.
     * 
     * @return true if amount is zero
     */
    public boolean isZero() {
        return amount.compareTo(BigDecimal.ZERO) == 0;
    }
    
    /**
     * Checks if this Money is greater than another Money.
     * Both Money objects must have the same currency.
     * 
     * @param other The Money to compare with
     * @return true if this Money is greater than the other
     * @throws IllegalArgumentException if currencies don't match
     */
    public boolean isGreaterThan(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException(
                String.format("Cannot compare different currencies: %s and %s", this.currency, other.currency)
            );
        }
        return this.amount.compareTo(other.amount) > 0;
    }
    
    @Override
    public String toString() {
        return String.format("%.2f %s", amount, currency);
    }
}
