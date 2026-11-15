package com.hiresmart.controller;

import com.hiresmart.dto.request.ChangePasswordRequest;
import com.hiresmart.dto.request.ForgotPasswordRequest;
import com.hiresmart.dto.request.LoginRequest;
import com.hiresmart.dto.request.RegisterRequest;
import com.hiresmart.dto.request.ResetPasswordRequest;
import com.hiresmart.dto.response.AuthResponse;
import com.hiresmart.dto.response.UserDto;
import com.hiresmart.entity.User;
import com.hiresmart.repository.UserRepository;
import com.hiresmart.security.SecurityUtils;
import com.hiresmart.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration, login, and identity verification")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new candidate or recruiter account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and receive a JWT Bearer token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Retrieve currently authenticated user information")
    public ResponseEntity<UserDto> getCurrentUser() {
        UserDto userDto = authService.getCurrentUserDto();
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request a password reset link via Mailtrap")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.initiatePasswordReset(request);
        return ResponseEntity.ok(Map.of(
                "message", "If an account exists with this email address, a password reset link has been dispatched to your email."
        ));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using the token sent by email")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of(
                "message", "Your password has been successfully updated. You may now sign in."
        ));
    }

    @PutMapping("/change-password")
    @Operation(summary = "Change password for the currently authenticated user")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        User currentUser = SecurityUtils.getCurrentUser(userRepository);
        authService.changePassword(currentUser, request);
        return ResponseEntity.ok(Map.of(
                "message", "Password changed successfully."
        ));
    }
}

