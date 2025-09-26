package com.turkcell.product.service.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.auditing.DateTimeProvider;

import java.time.Instant;
import java.util.Optional;

/**
 * Configuration for JPA Auditing.
 * Provides DateTimeProvider for auditing timestamps.
 */
@Configuration
public class JpaAuditingConfig {
    
    /**
     * Provides the current timestamp for JPA auditing.
     * Uses Instant to ensure consistent timestamp format across the application.
     * 
     * @return DateTimeProvider that returns current Instant
     */
    @Bean(name = "auditingDateTimeProvider")
    public DateTimeProvider auditingDateTimeProvider() {
        return () -> Optional.of(Instant.now());
    }
}
