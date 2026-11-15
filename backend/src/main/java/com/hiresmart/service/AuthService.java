package com.hiresmart.service;

import com.hiresmart.dto.request.ChangePasswordRequest;
import com.hiresmart.dto.request.ForgotPasswordRequest;
import com.hiresmart.dto.request.LoginRequest;
import com.hiresmart.dto.request.RegisterRequest;
import com.hiresmart.dto.request.ResetPasswordRequest;
import com.hiresmart.dto.response.AuthResponse;
import com.hiresmart.dto.response.UserDto;
import com.hiresmart.entity.CandidateProfile;
import com.hiresmart.entity.PasswordResetToken;
import com.hiresmart.entity.RecruiterProfile;
import com.hiresmart.entity.Role;
import com.hiresmart.entity.User;
import com.hiresmart.exception.BadRequestException;
import com.hiresmart.exception.DuplicateResourceException;
import com.hiresmart.repository.CandidateProfileRepository;
import com.hiresmart.repository.PasswordResetTokenRepository;
import com.hiresmart.repository.RecruiterProfileRepository;
import com.hiresmart.repository.UserRepository;
import com.hiresmart.security.JwtService;
import com.hiresmart.security.SecurityUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuditLogService auditLogService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       CandidateProfileRepository candidateProfileRepository,
                       RecruiterProfileRepository recruiterProfileRepository,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       AuditLogService auditLogService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.auditLogService = auditLogService;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with email " + request.getEmail() + " already exists");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole()
        );
        User savedUser = userRepository.save(user);

        String displayName;
        if (request.getRole() == Role.CANDIDATE) {
            String firstName = request.getFirstName() != null && !request.getFirstName().isBlank() ? request.getFirstName() : "Candidate";
            String lastName = request.getLastName() != null && !request.getLastName().isBlank() ? request.getLastName() : "User";
            CandidateProfile profile = new CandidateProfile(savedUser, firstName, lastName);
            candidateProfileRepository.save(profile);
            displayName = firstName + " " + lastName;
        } else if (request.getRole() == Role.RECRUITER) {
            String company = request.getCompanyName() != null && !request.getCompanyName().isBlank() ? request.getCompanyName() : "Hiring Company";
            RecruiterProfile profile = new RecruiterProfile(savedUser, company);
            recruiterProfileRepository.save(profile);
            displayName = company;
        } else {
            throw new BadRequestException("Unsupported user role: " + request.getRole());
        }

        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name());
        auditLogService.log("USER_REGISTER", savedUser.getEmail(), savedUser.getRole().name(), "User #" + savedUser.getId(), "Account created as " + savedUser.getRole());
        return new AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getRole(), displayName);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        String displayName = user.getEmail();
        if (user.getRole() == Role.CANDIDATE) {
            displayName = candidateProfileRepository.findByUserId(user.getId())
                    .map(cp -> cp.getFirstName() + " " + cp.getLastName())
                    .orElse(user.getEmail());
        } else if (user.getRole() == Role.RECRUITER) {
            displayName = recruiterProfileRepository.findByUserId(user.getId())
                    .map(RecruiterProfile::getCompanyName)
                    .orElse(user.getEmail());
        } else if (user.getRole() == Role.ADMIN) {
            displayName = "System Administrator";
        }

        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        auditLogService.log("USER_LOGIN", user.getEmail(), user.getRole().name(), "Auth Session", "Successful authentication session established");
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole(), displayName);
    }

    public UserDto getCurrentUserDto() {
        User user = SecurityUtils.getCurrentUser(userRepository);
        return new UserDto(user.getId(), user.getEmail(), user.getRole());
    }

    @Transactional
    public void initiatePasswordReset(ForgotPasswordRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        userRepository.findByEmail(cleanEmail).ifPresent(user -> {
            passwordResetTokenRepository.invalidateActiveTokensForUser(user);

            String token = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().substring(0, 8);
            Instant expiresAt = Instant.now().plus(Duration.ofHours(1));

            PasswordResetToken resetToken = new PasswordResetToken(user, token, expiresAt);
            passwordResetTokenRepository.save(resetToken);

            String recipientName = user.getEmail();
            if (user.getRole() == Role.CANDIDATE) {
                recipientName = candidateProfileRepository.findByUserId(user.getId())
                        .map(cp -> cp.getFirstName() + " " + cp.getLastName())
                        .orElse(user.getEmail());
            } else if (user.getRole() == Role.RECRUITER) {
                recipientName = recruiterProfileRepository.findByUserId(user.getId())
                        .map(RecruiterProfile::getCompanyName)
                        .orElse(user.getEmail());
            }

            emailService.sendPasswordResetEmail(user.getEmail(), recipientName, token);
            auditLogService.log("PASSWORD_RESET_REQUESTED", user.getEmail(), user.getRole().name(), "Auth Security", "Password reset token generated and dispatched via Mailtrap");
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken().trim())
                .orElseThrow(() -> new BadRequestException("The password reset link is invalid or has expired. Please request a new one."));

        if (resetToken.isUsed() || resetToken.isExpired()) {
            throw new BadRequestException("The password reset link has expired or has already been used. Please request a new one.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        auditLogService.log("PASSWORD_RESET_COMPLETED", user.getEmail(), user.getRole().name(), "Auth Security", "User password successfully reset via token");
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match our records.");
        }

        if (request.getNewPassword().equals(request.getCurrentPassword())) {
            throw new BadRequestException("New password cannot be the same as your current password.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        auditLogService.log("PASSWORD_CHANGED", user.getEmail(), user.getRole().name(), "Auth Security", "User changed account password from profile security tab");
    }
}
