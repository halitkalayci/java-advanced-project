package com.turkcell.product.service.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuration for OpenAPI (Swagger) documentation.
 * Provides comprehensive API documentation for the Catalog Service.
 */
@Configuration
public class OpenApiConfig {
    
    @Value("${server.port:8080}")
    private String serverPort;
    
    @Value("${spring.application.name:product-service}")
    private String applicationName;
    
    /**
     * Configures the OpenAPI specification for the Product Service.
     * 
     * @return OpenAPI configuration
     */
    @Bean
    public OpenAPI productServiceOpenAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(List.of(
                    new Server()
                        .url("http://localhost:" + serverPort)
                        .description("Development server"),
                    new Server()
                        .url("https://api.example.com")
                        .description("Production server")
                ));
    }
    
    /**
     * Creates API information for the OpenAPI specification.
     * 
     * @return Info object with API details
     */
    private Info apiInfo() {
        return new Info()
                .title("Product Service API")
                .description("RESTful API for managing products using DDD and Hexagonal Architecture")
                .version("1.0.0")
                .contact(new Contact()
                    .name("Turkcell Development Team")
                    .email("dev@turkcell.com.tr")
                    .url("https://www.turkcell.com.tr"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT"));
    }
}
