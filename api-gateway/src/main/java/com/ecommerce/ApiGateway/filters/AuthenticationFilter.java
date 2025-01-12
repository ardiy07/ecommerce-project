package com.ecommerce.ApiGateway.filters;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.ecommerce.ApiGateway.utils.JwtUtil;
import com.ecommerce.ApiGateway.validators.RouterValidator;

import reactor.core.publisher.Mono;

@RefreshScope
@Component
public class AuthenticationFilter implements GatewayFilter {
    @Autowired
    private RouterValidator validator;
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        if (validator.isSecured.test(request)) {
            if (authMissing(request)) {
                return onError(exchange, HttpStatus.UNAUTHORIZED, "error", "Authorization header is missing");
            }

            final String token = request.getHeaders().getOrEmpty("Authorization").get(0).substring(7);

            if (jwtUtil.isExpired(token)) {
                return onError(exchange, HttpStatus.UNAUTHORIZED, "error", "Token expired");
            }

            if (jwtUtil.getClaims(token).get("userId") != null) {
                String userId = jwtUtil.getClaims(token).get("userId").toString();
                String role = jwtUtil.getClaims(token).get("role").toString();
                
                ServerHttpRequest mutatedRequest = request.mutate()
                        .header("X-User-Id", userId)
                        .header("X-User-Role", role)
                        .build();
                exchange = exchange.mutate().request(mutatedRequest).build();
            } else {
                return onError(exchange, HttpStatus.INTERNAL_SERVER_ERROR, "error", "Claims tidak ada atau tidak valid");
            }
        }
        return chain.filter(exchange);
    }
    
    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus httpStatus, String status, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String jsonResponse = String.format("{\"status\":\"%s\", \"message\":\"%s\"}", status, message);

        DataBufferFactory factory = response.bufferFactory();
        DataBuffer buffer = factory.wrap(jsonResponse.getBytes());
        return response.writeWith(Mono.just(buffer));
    }

    private boolean authMissing(ServerHttpRequest request) {
        return !request.getHeaders().containsKey("Authorization");
    }
}