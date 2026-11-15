package com.hiresmart.controller;

import com.hiresmart.dto.request.CreateUserRequest;
import com.hiresmart.dto.request.JobOfferRequest;
import com.hiresmart.dto.request.SkillRequest;
import com.hiresmart.dto.request.UpdateUserRoleRequest;
import com.hiresmart.dto.response.*;
import com.hiresmart.entity.User;
import com.hiresmart.repository.UserRepository;
import com.hiresmart.security.SecurityUtils;
import com.hiresmart.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Administrator Operations", description = "Platform governance, metrics, user lifecycle, audit trail, and global configuration")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    public AdminController(AdminService adminService, UserRepository userRepository) {
        this.adminService = adminService;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get platform metrics", description = "Retrieves aggregated counts of users, jobs, applications, and AI match analytics")
    public ResponseEntity<AdminStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }

    @GetMapping("/users")
    @Operation(summary = "List all users", description = "Retrieves all registered platform users with role and profile summaries")
    public ResponseEntity<List<AdminUserDto>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users")
    @Operation(summary = "Provision a user account", description = "Creates a new user with specific role and profile attributes")
    public ResponseEntity<AdminUserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        User admin = SecurityUtils.getCurrentUser(userRepository);
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createUser(admin, request));
    }

    @PatchMapping("/users/{id}/role")
    @Operation(summary = "Update user role", description = "Changes the authorization role of an existing user")
    public ResponseEntity<AdminUserDto> updateUserRole(@PathVariable Long id, @Valid @RequestBody UpdateUserRoleRequest request) {
        User admin = SecurityUtils.getCurrentUser(userRepository);
        return ResponseEntity.ok(adminService.updateUserRole(admin, id, request.getRole()));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user", description = "Permanently removes a user and cascades related profile and application data")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        User admin = SecurityUtils.getCurrentUser(userRepository);
        adminService.deleteUser(admin, id);
        return ResponseEntity.ok(Map.of("message", "User successfully deleted"));
    }

    @GetMapping("/jobs")
    @Operation(summary = "List all platform jobs", description = "Retrieves all job offers across all hiring companies")
    public ResponseEntity<List<JobOfferDto>> getJobs() {
        return ResponseEntity.ok(adminService.getAllJobs());
    }

    @PostMapping("/jobs")
    @Operation(summary = "Create global job offer", description = "Publishes a new job offer as an administrator")
    public ResponseEntity<JobOfferDto> createJob(@Valid @RequestBody JobOfferRequest request) {
        User admin = SecurityUtils.getCurrentUser(userRepository);
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createJobGlobal(admin, request));
    }

    @PatchMapping("/jobs/{id}/status")
    @Operation(summary = "Toggle job status", description = "Toggles status between ACTIVE and CLOSED")
    public ResponseEntity<JobOfferDto> toggleJobStatus(@PathVariable Long id) {
        User admin = SecurityUtils.getCurrentUser(userRepository);
        return ResponseEntity.ok(adminService.toggleJobStatus(admin, id));
    }

    @DeleteMapping("/jobs/{id}")
    @Operation(summary = "Delete job offer", description = "Permanently removes a job offer posting")
    public ResponseEntity<Map<String, String>> deleteJob(@PathVariable Long id) {
        User admin = SecurityUtils.getCurrentUser(userRepository);
        adminService.deleteJob(admin, id);
        return ResponseEntity.ok(Map.of("message", "Job offer successfully deleted"));
    }

    @GetMapping("/config")
    @Operation(summary = "Get system configs and telemetry", description = "Returns active platform configuration and real-time JVM / DB telemetry")
    public ResponseEntity<Map<String, Object>> getConfig() {
        Map<String, Object> result = new HashMap<>();
        result.put("configs", adminService.getSystemConfigs());
        result.put("telemetry", adminService.getSystemTelemetry());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/config")
    @Operation(summary = "Update system config", description = "Updates a platform configuration parameter")
    public ResponseEntity<SystemConfigDto> updateConfig(@RequestBody Map<String, String> body) {
        User admin = SecurityUtils.getCurrentUser(userRepository);
        String key = body.get("key");
        String value = body.get("value");
        return ResponseEntity.ok(adminService.updateSystemConfig(admin, key, value));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get audit trail", description = "Retrieves chronological log of platform actions and system events")
    public ResponseEntity<List<AuditLogDto>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getAuditLogs());
    }

    @GetMapping("/skills")
    @Operation(summary = "List all skills", description = "Retrieves all registered skills ordered by most recent by default, with optional search, category filter, and sort")
    public ResponseEntity<List<SkillDto>> getSkills(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "recent") String sort) {
        return ResponseEntity.ok(adminService.getAllSkills(query, category, sort));
    }

    @PostMapping("/skills")
    @Operation(summary = "Add a new skill", description = "Persists a new unique skill into the database permanent registry")
    public ResponseEntity<SkillDto> createSkill(@Valid @RequestBody SkillRequest request) {
        User admin = SecurityUtils.getCurrentUser(userRepository);
        SkillDto created = adminService.createSkill(admin, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/skills/{id}")
    @Operation(summary = "Modify an existing skill", description = "Updates the name or category of a skill")
    public ResponseEntity<SkillDto> updateSkill(@PathVariable Long id, @Valid @RequestBody SkillRequest request) {
        User admin = SecurityUtils.getCurrentUser(userRepository);
        SkillDto updated = adminService.updateSkill(admin, id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/skills/{id}")
    @Operation(summary = "Remove a skill", description = "Deletes a skill from the database permanent registry")
    public ResponseEntity<Map<String, String>> deleteSkill(@PathVariable Long id) {
        User admin = SecurityUtils.getCurrentUser(userRepository);
        adminService.deleteSkill(admin, id);
        return ResponseEntity.ok(Map.of("message", "Skill successfully deleted"));
    }
}
