package com.ecommerce.ApiGateway.validators;

import java.util.List;
import java.util.function.Predicate;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Service;

@Service
public class RouterValidator {
    
    public static final List<String> openEndpoints = List.of(
        "/auth/login",
        "/auth/verify-email",
        "/auth/verify-otp",
        "/auth/register",
        "/user/test"
    );

    public Predicate<ServerHttpRequest> isSecured =
        request -> openEndpoints.stream()
            .noneMatch(uri -> request.getURI().getPath().contains(uri));
}
