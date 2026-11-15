package com.hiresmart.config;

import com.hiresmart.entity.CandidateProfile;
import com.hiresmart.entity.RecruiterProfile;
import com.hiresmart.entity.Role;
import com.hiresmart.entity.User;
import com.hiresmart.repository.CandidateProfileRepository;
import com.hiresmart.repository.JobOfferRepository;
import com.hiresmart.repository.RecruiterProfileRepository;
import com.hiresmart.repository.UserRepository;
import com.hiresmart.service.SkillService;
import com.hiresmart.service.SkillMatchingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.hiresmart.service.AuditLogService;

import java.io.File;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobOfferRepository jobOfferRepository;
    private final SkillService skillService;
    private final SkillMatchingService skillMatchingService;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Value("${hiresmart.upload.dir:/app/uploads/cvs}")
    private String uploadDir;

    public DataInitializer(UserRepository userRepository,
                           CandidateProfileRepository candidateProfileRepository,
                           RecruiterProfileRepository recruiterProfileRepository,
                           JobOfferRepository jobOfferRepository,
                           SkillService skillService,
                           SkillMatchingService skillMatchingService,
                           PasswordEncoder passwordEncoder,
                           AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.skillService = skillService;
        this.skillMatchingService = skillMatchingService;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @Override
    public void run(String... args) {
        // Ensure CV upload directory exists
        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                logger.info("Created CV upload directory: {} (status: {})", uploadDir, created);
            }
        } catch (Exception e) {
            logger.warn("Could not create CV upload directory: {}", e.getMessage());
        }

        // Initialize or synchronize default demonstration credentials
        initUser("admin@hiresmart.ai", "Admin123!", Role.ADMIN, "System Administrator");
        initUser("capgemini@gmail.com", "Recruiter123!", Role.RECRUITER, "Capgemini Engineering");
        initUser("youssef.benali@candidates.ma", "Candidate123!", Role.CANDIDATE, "Youssef Benali");
        initUser("recruiter@hiresmart.ai", "Recruiter123!", Role.RECRUITER, "TechNova Innovations");
        initUser("candidate@hiresmart.ai", "Candidate123!", Role.CANDIDATE, "Alex Vance");
        initUser("john.doe@example.com", "Candidate123!", Role.CANDIDATE, "John Doe");

        // Synchronize permanent skills registry with any existing job offers and canonical skills
        try {
            for (String skillsStr : jobOfferRepository.findAllRequiredSkillsStrings()) {
                skillService.saveSkillsFromText(skillsStr);
            }
            skillService.saveSkills(skillMatchingService.getCanonicalSkills());
            logger.info("Permanent skills registry synchronized successfully");
        } catch (Exception e) {
            logger.warn("Could not sync permanent skills registry: {}", e.getMessage());
        }
    }

    private void initUser(String email, String rawPassword, Role role, String name) {
        userRepository.findByEmail(email).ifPresentOrElse(user -> {
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
            logger.info("Updated demonstration user credentials for: {}", email);
        }, () -> {
            User newUser = new User(email, passwordEncoder.encode(rawPassword), role);
            User saved = userRepository.save(newUser);
            if (role == Role.RECRUITER) {
                RecruiterProfile rp = new RecruiterProfile(saved, name);
                rp.setLocation("Paris, France");
                recruiterProfileRepository.save(rp);
            } else if (role == Role.CANDIDATE) {
                String[] parts = name.split(" ", 2);
                String first = parts[0];
                String last = parts.length > 1 ? parts[1] : "User";
                CandidateProfile cp = new CandidateProfile(saved, first, last);
                cp.setTitle("Software Engineer");
                candidateProfileRepository.save(cp);
            }
            auditLogService.log(
                    "USER_REGISTER",
                    saved.getEmail(),
                    saved.getRole().name(),
                    "User #" + saved.getId(),
                    "Demonstration account initialized as " + saved.getRole()
            );
            logger.info("Created demonstration user: {} ({})", email, role);
        });
    }
}
