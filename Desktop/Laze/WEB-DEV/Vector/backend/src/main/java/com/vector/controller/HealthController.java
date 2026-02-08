package com.vector.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("service", "Vector Backend API");
        return ResponseEntity.ok(health);
    }

    @GetMapping("/db")
    public ResponseEntity<Map<String, Object>> databaseHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("timestamp", LocalDateTime.now());

        try (Connection connection = dataSource.getConnection()) {
            boolean isValid = connection.isValid(5);
            health.put("database", isValid ? "UP" : "DOWN");
            health.put("status", isValid ? "UP" : "DOWN");

            if (isValid) {
                health.put("databaseProduct", connection.getMetaData().getDatabaseProductName());
                health.put("databaseVersion", connection.getMetaData().getDatabaseProductVersion());
            }
        } catch (Exception e) {
            health.put("database", "DOWN");
            health.put("status", "DOWN");
            health.put("error", e.getMessage());
            return ResponseEntity.status(503).body(health);
        }

        return ResponseEntity.ok(health);
    }

    @GetMapping("/ready")
    public ResponseEntity<Map<String, Object>> readiness() {
        Map<String, Object> status = new HashMap<>();
        status.put("timestamp", LocalDateTime.now());

        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(5)) {
                status.put("status", "READY");
                status.put("database", "CONNECTED");
                return ResponseEntity.ok(status);
            }
        } catch (Exception e) {
            status.put("status", "NOT_READY");
            status.put("error", e.getMessage());
            return ResponseEntity.status(503).body(status);
        }

        status.put("status", "NOT_READY");
        return ResponseEntity.status(503).body(status);
    }
}
