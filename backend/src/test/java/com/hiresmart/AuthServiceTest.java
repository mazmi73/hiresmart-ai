package com.hiresmart;

import com.hiresmart.dto.request.LoginRequest;
import com.hiresmart.dto.request.RegisterRequest;
import com.hiresmart.dto.response.AuthResponse;
import com.hiresmart.entity.CandidateProfile;
import com.hiresmart.entity.RecruiterProfile;
import com.hiresmart.entity.Role;
import com.hiresmart.entity.User;
import com.hiresmart.exception.DuplicateResourceException;
import com.hiresmart.repository.CandidateProfileRepository;
import com.hiresmart.repository.RecruiterProfileRepository;
import com.hiresmart.repository.UserRepository;
import com.hiresmart.security.JwtService;
import com.hiresmart.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CandidateProfileRepository candidateProfileRepository;

    @Mock
    private RecruiterProfileRepository recruiterProfileRepository;

    @Mock
    private com.hiresmart.repository.PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private com.hiresmart.service.AuditLogService auditLogService;

    @Mock
    private com.hiresmart.service.EmailService emailService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository,
                candidateProfileRepository,
                recruiterProfileRepository,
                passwordResetTokenRepository,
                passwordEncoder,
                jwtService,
                authenticationManager,
                auditLogService,
                emailService
        );
    }

    @Test
    @DisplayName("Should successfully register a new candidate")
    void testRegisterCandidateSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("alex.vance@example.com");
        request.setPassword("Password123!");
        request.setRole(Role.CANDIDATE);
        request.setFirstName("Alex");
        request.setLastName("Vance");

        when(userRepository.existsByEmail("alex.vance@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("hashed_password");

        User savedUser = new User("alex.vance@example.com", "hashed_password", Role.CANDIDATE);
        savedUser.setId(10L);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name()))
                .thenReturn("mocked.jwt.token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("alex.vance@example.com", response.getEmail());
        assertEquals(Role.CANDIDATE, response.getRole());
        assertEquals("Alex Vance", response.getDisplayName());
        assertEquals("mocked.jwt.token", response.getToken());

        verify(candidateProfileRepository, times(1)).save(any(CandidateProfile.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when registering existing email")
    void testRegisterDuplicateEmailThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@hiresmart.ai");
        request.setPassword("Password123!");
        request.setRole(Role.CANDIDATE);

        when(userRepository.existsByEmail("existing@hiresmart.ai")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
    }

    @Test
    @DisplayName("Should authenticate and return JWT on valid login")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("recruiter@hiresmart.ai", "Recruiter123!");

        User user = new User("recruiter@hiresmart.ai", "hashed_password", Role.RECRUITER);
        user.setId(1L);

        when(userRepository.findByEmail("recruiter@hiresmart.ai")).thenReturn(Optional.of(user));
        when(jwtService.generateToken("recruiter@hiresmart.ai", 1L, "RECRUITER")).thenReturn("valid.token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("valid.token", response.getToken());
        assertEquals(Role.RECRUITER, response.getRole());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}
