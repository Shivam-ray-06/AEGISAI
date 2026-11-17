package com.aegisai.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Component
public class AiServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AiServiceClient.class);

    private final RestTemplate restTemplate;
    private final String aiServiceUrl;
    private final ObjectMapper objectMapper;

    public AiServiceClient(RestTemplateBuilder builder, 
                           @Value("${aegisai.ai-service.url:http://localhost:8000}") String aiServiceUrl) {
        this.restTemplate = builder
                .connectTimeout(Duration.ofSeconds(5))
                .readTimeout(Duration.ofSeconds(120))
                .build();
        this.aiServiceUrl = aiServiceUrl;
        this.objectMapper = new ObjectMapper();
    }

    public boolean checkHealth() {
        try {
            ResponseEntity<JsonNode> response = restTemplate.getForEntity(aiServiceUrl + "/health", JsonNode.class);
            return response.getStatusCode().is2xxSuccessful() && 
                   "UP".equalsIgnoreCase(response.getBody().path("status").asText());
        } catch (Exception e) {
            log.warn("AI Inference Service health check failed at {}: {}", aiServiceUrl, e.getMessage());
            return false;
        }
    }

    public void triggerAnalysis(String videoId, String videoPath) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("videoId", videoId);
        body.put("videoPath", videoPath);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<JsonNode> response = restTemplate.postForEntity(aiServiceUrl + "/analyze", request, JsonNode.class);
            log.info("Analysis triggered for videoId {}: status {}", videoId, response.getStatusCode());
        } catch (Exception e) {
            log.error("Failed to trigger AI analysis for videoId {}: {}", videoId, e.getMessage());
            throw new RuntimeException("Could not initiate AI analysis service: " + e.getMessage(), e);
        }
    }

    public JsonNode getJobStatus(String videoId) {
        try {
            ResponseEntity<JsonNode> response = restTemplate.getForEntity(
                    aiServiceUrl + "/jobs/" + videoId + "/status", JsonNode.class);
            return response.getBody();
        } catch (Exception e) {
            log.warn("Failed to query status for job {}: {}", videoId, e.getMessage());
            return null;
        }
    }

    public JsonNode getJobResults(String videoId) {
        try {
            ResponseEntity<JsonNode> response = restTemplate.getForEntity(
                    aiServiceUrl + "/jobs/" + videoId + "/results", JsonNode.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to query results for job {}: {}", videoId, e.getMessage());
            throw new RuntimeException("Failed to fetch AI analysis results: " + e.getMessage(), e);
        }
    }
}
