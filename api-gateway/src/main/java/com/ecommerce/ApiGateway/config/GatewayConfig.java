package com.ecommerce.ApiGateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ecommerce.ApiGateway.filters.AuthenticationFilter;

@Configuration
public class GatewayConfig {
    private final AuthenticationFilter filter;

    public GatewayConfig(AuthenticationFilter filter) {
        this.filter = filter;        
    }

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("auth-service", r -> r.path("/api/v1/auth/**")
                .filters(f -> f
                    .filter(filter)
                    .rewritePath("/api/v1/auth/(?<segment>.*)", "/auth/${segment}")
                )
                .uri("http://auth-service:3005"))
            .route("user-service", r -> r.path("/api/v1/user/**")
                .filters(f -> f
                    .filter(filter)
                    .rewritePath("/api/v1/user/(?<segment>.*)", "/user/${segment}")
                )
                .uri("http://user-service:3008"))
           .build();
    }
}