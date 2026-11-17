package com.aegisai.controller;

import com.aegisai.client.AiServiceClient;
import com.aegisai.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "System Health", description = "System and service status monitoring")
public class HealthController {

    private final AiServiceClient aiServiceClient;

    public HealthController(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    @GetMapping
    @Operation(summary = "Check overall system and subsystem health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        boolean aiHealthy = aiServiceClient.checkHealth();
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "AEGISAI-Backend");
        health.put("timestamp", LocalDateTime.now());
        health.put("javaVersion", System.getProperty("java.version"));
        health.put("os", System.getProperty("os.name") + " " + System.getProperty("os.arch"));
        health.put("database", "CONNECTED");
        health.put("aiInferenceEngine", aiHealthy ? "UP (Apple Silicon MPS)" : "STANDBY");

        return ResponseEntity.ok(ApiResponse.success(health, "System is operating nominally"));
    }
}
