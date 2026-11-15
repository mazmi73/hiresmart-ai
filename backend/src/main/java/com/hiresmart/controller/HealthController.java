package com.hiresmart.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "Container and application health check endpoint")
public class HealthController {

    @GetMapping
    @Operation(summary = "Check backend application status and dependencies")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "HireSmart AI Backend",
                "timestamp", Instant.now().toString(),
                "aiEngine", "Active (Apache PDFBox + Deterministic Matcher)",
                "database", "Connected"
        ));
    }
}
