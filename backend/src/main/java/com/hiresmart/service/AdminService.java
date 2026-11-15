package com.hiresmart.service;

import com.hiresmart.dto.request.CreateUserRequest;
import com.hiresmart.dto.request.JobOfferRequest;
import com.hiresmart.dto.request.SkillRequest;
import com.hiresmart.dto.response.*;
import com.hiresmart.entity.*;
import com.hiresmart.exception.BadRequestException;
import com.hiresmart.exception.DuplicateResourceException;
import com.hiresmart.exception.ResourceNotFoundException;
import com.hiresmart.repository.*;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobOfferRepository jobOfferRepository;
    private final ApplicationRepository applicationRepository;
    private final CVAnalysisRepository cvAnalysisRepository;
    private final CVDocumentRepository cvDocumentRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final SkillRepository skillRepository;
    private final AuditLogService auditLogService;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository,
                        CandidateProfileRepository candidateProfileRepository,
                        RecruiterProfileRepository recruiterProfileRepository,
                        JobOfferRepository jobOfferRepository,
                        ApplicationRepository applicationRepository,
                        CVAnalysisRepository cvAnalysisRepository,
                        CVDocumentRepository cvDocumentRepository,
                        SystemConfigRepository systemConfigRepository,
                        SkillRepository skillRepository,
                        AuditLogService auditLogService,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.applicationRepository = applicationRepository;
        this.cvAnalysisRepository = cvAnalysisRepository;
        this.cvDocumentRepository = cvDocumentRepository;
        this.systemConfigRepository = systemConfigRepository;
        this.skillRepository = skillRepository;
        this.auditLogService = auditLogService;
        this.passwordEncoder = passwordEncoder;
    }

    public AdminStatsDto getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalCandidates = userRepository.countByRole(Role.CANDIDATE);
        long totalRecruiters = userRepository.countByRole(Role.RECRUITER);
        long totalAdmins = userRepository.countByRole(Role.ADMIN);

        long totalJobOffers = jobOfferRepository.count();
        long activeJobOffers = jobOfferRepository.countByStatus(JobStatus.ACTIVE);
        long closedJobOffers = jobOfferRepository.countByStatus(JobStatus.CLOSED);

        long totalApplications = applicationRepository.count();

        List<CVAnalysis> analyses = cvAnalysisRepository.findAll();
        long totalAnalyzed = analyses.size();

        double avgScore = 0.0;
        if (!analyses.isEmpty()) {
            double sum = analyses.stream().mapToDouble(CVAnalysis::getMatchPercentage).sum();
            avgScore = BigDecimal.valueOf(sum / analyses.size())
                    .setScale(1, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        long totalSkills = skillRepository.count();

        return new AdminStatsDto(
                totalUsers, totalCandidates, totalRecruiters, totalAdmins,
                totalJobOffers, activeJobOffers, closedJobOffers,
                totalApplications, totalAnalyzed, avgScore, totalSkills
        );
    }

    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc().stream()
                .sorted((u1, u2) -> {
                    if (u1.getRole() == Role.ADMIN && u2.getRole() != Role.ADMIN) return -1;
                    if (u1.getRole() != Role.ADMIN && u2.getRole() == Role.ADMIN) return 1;
                    return 0;
                })
                .map(this::mapToAdminUserDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminUserDto createUser(User adminActor, CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new DuplicateResourceException("An account with email " + request.getEmail() + " already exists");
        }

        User newUser = new User(
                request.getEmail().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole()
        );
        User savedUser = userRepository.save(newUser);

        if (request.getRole() == Role.CANDIDATE) {
            String first = request.getFirstName() != null && !request.getFirstName().isBlank() ? request.getFirstName().trim() : "Candidate";
            String last = request.getLastName() != null && !request.getLastName().isBlank() ? request.getLastName().trim() : "User";
            CandidateProfile cp = new CandidateProfile(savedUser, first, last);
            if (request.getTitleOrLocation() != null && !request.getTitleOrLocation().isBlank()) {
                cp.setTitle(request.getTitleOrLocation().trim());
            }
            candidateProfileRepository.save(cp);
        } else if (request.getRole() == Role.RECRUITER) {
            String company = request.getCompanyName() != null && !request.getCompanyName().isBlank() ? request.getCompanyName().trim() : "Company";
            RecruiterProfile rp = new RecruiterProfile(savedUser, company);
            if (request.getTitleOrLocation() != null && !request.getTitleOrLocation().isBlank()) {
                rp.setLocation(request.getTitleOrLocation().trim());
            }
            recruiterProfileRepository.save(rp);
        }

        auditLogService.log(
                "USER_REGISTER",
                savedUser.getEmail(),
                savedUser.getRole().name(),
                "User #" + savedUser.getId(),
                "Account created as " + savedUser.getRole() + " for " + savedUser.getEmail() + " (provisioned by admin)"
        );

        return mapToAdminUserDto(savedUser);
    }

    @Transactional
    public AdminUserDto updateUserRole(User adminActor, Long userId, Role newRole) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (target.getRole() == Role.ADMIN) {
            throw new BadRequestException("Administrator accounts are protected and cannot be downgraded to recruiter or candidate");
        }

        if (newRole != Role.RECRUITER && newRole != Role.CANDIDATE) {
            throw new BadRequestException("User roles can only be swapped between RECRUITER and CANDIDATE");
        }

        Role oldRole = target.getRole();
        target.setRole(newRole);
        userRepository.save(target);

        auditLogService.log(
                "USER_ROLE_CHANGED",
                adminActor.getEmail(),
                adminActor.getRole().name(),
                "User #" + target.getId(),
                "Changed role for " + target.getEmail() + " from " + oldRole + " to " + newRole
        );

        return mapToAdminUserDto(target);
    }

    @Transactional
    public void deleteUser(User admin, Long userId) {
        if (admin.getId().equals(userId)) {
            throw new BadRequestException("You cannot delete your own administrator account");
        }

        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (target.getRole() == Role.ADMIN) {
            throw new BadRequestException("Administrator accounts are protected and cannot be deleted");
        }

        String targetEmail = target.getEmail();
        Role targetRole = target.getRole();

        userRepository.delete(target);

        auditLogService.log(
                "USER_DELETED",
                admin.getEmail(),
                admin.getRole().name(),
                "User #" + userId,
                "Permanently removed " + targetRole + " account: " + targetEmail
        );
    }

    public List<JobOfferDto> getAllJobs() {
        return jobOfferRepository.findAllByOrderByCreatedAtDesc().stream().map(this::mapToJobDto).collect(Collectors.toList());
    }

    @Transactional
    public JobOfferDto toggleJobStatus(User adminActor, Long jobId) {
        JobOffer job = jobOfferRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job offer not found with ID: " + jobId));

        JobStatus nextStatus = job.getStatus() == JobStatus.ACTIVE ? JobStatus.CLOSED : JobStatus.ACTIVE;
        job.setStatus(nextStatus);
        JobOffer saved = jobOfferRepository.save(job);

        auditLogService.log(
                "JOB_STATUS_MODERATED",
                adminActor.getEmail(),
                adminActor.getRole().name(),
                "Job Offer #" + jobId,
                "Moderated job '" + job.getTitle() + "' status to " + nextStatus
        );

        return mapToJobDto(saved);
    }

    @Transactional
    public void deleteJob(User adminActor, Long jobId) {
        JobOffer job = jobOfferRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job offer not found with ID: " + jobId));

        String jobTitle = job.getTitle();
        String company = job.getCompanyName();

        jobOfferRepository.delete(job);

        auditLogService.log(
                "JOB_DELETED",
                adminActor.getEmail(),
                adminActor.getRole().name(),
                "Job Offer #" + jobId,
                "Deleted job offer '" + jobTitle + "' for " + company
        );
    }

    @Transactional
    public JobOfferDto createJobGlobal(User adminActor, JobOfferRequest request) {
        // Pick an existing recruiter or use admin user
        User recruiter = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.RECRUITER)
                .findFirst()
                .orElse(adminActor);

        JobOffer job = new JobOffer();
        job.setRecruiter(recruiter);
        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription().trim());
        job.setCompanyName(request.getCompanyName() != null && !request.getCompanyName().isBlank() ? request.getCompanyName().trim() : "HireSmart Partner");
        job.setLocation(request.getLocation() != null && !request.getLocation().isBlank() ? request.getLocation().trim() : "Remote");
        job.setEmploymentType(request.getEmploymentType());
        job.setWorkplaceType(request.getWorkplaceType() != null ? request.getWorkplaceType() : WorkplaceType.ON_SITE);
        job.setExperienceLevel(request.getExperienceLevel());
        job.setRequiredSkills(request.getRequiredSkills().trim());
        job.setMatchThreshold(request.getMatchThreshold() != null ? request.getMatchThreshold() : 70);
        job.setStatus(JobStatus.ACTIVE);

        JobOffer saved = jobOfferRepository.save(job);

        auditLogService.log(
                "JOB_CREATED",
                adminActor.getEmail(),
                adminActor.getRole().name(),
                "Job Offer #" + saved.getId(),
                saved.getTitle() + " job offer posted by admin for " + saved.getCompanyName()
        );

        return mapToJobDto(saved);
    }

    public List<SystemConfigDto> getSystemConfigs() {
        if (systemConfigRepository.findByConfigKey("GEMINI_API_KEY").isEmpty()) {
            systemConfigRepository.save(new SystemConfig("GEMINI_API_KEY", "", "Google Gemini API Key for Cloud LLM Analysis (AIzaSy...)"));
        }
        if (systemConfigRepository.findByConfigKey("GROQ_API_KEY").isEmpty()) {
            systemConfigRepository.save(new SystemConfig("GROQ_API_KEY", "", "GroqCloud API Key for Meta Llama 3.3 70B (gsk_...)"));
        }
        if (systemConfigRepository.findByConfigKey("MISTRAL_API_KEY").isEmpty()) {
            systemConfigRepository.save(new SystemConfig("MISTRAL_API_KEY", "", "Mistral AI API Key for Mistral Small Analysis"));
        }
        return systemConfigRepository.findAll().stream()
                .filter(c -> !"OPENAI_API_KEY".equalsIgnoreCase(c.getConfigKey())
                        && !"CLAUDE_API_KEY".equalsIgnoreCase(c.getConfigKey())
                        && !"REGISTRATION_OPEN".equalsIgnoreCase(c.getConfigKey())
                        && !"MAINTENANCE_MODE".equalsIgnoreCase(c.getConfigKey()))
                .map(c ->
                    new SystemConfigDto(c.getConfigKey(), c.getConfigValue(), c.getDescription(), c.getUpdatedAt())
                ).collect(Collectors.toList());
    }

    @Transactional
    public SystemConfigDto updateSystemConfig(User adminActor, String key, String value) {
        SystemConfig config = systemConfigRepository.findByConfigKey(key)
                .orElse(new SystemConfig(key, value != null ? value.trim() : "", "Custom platform configuration"));

        String oldValue = config.getConfigValue();
        config.setConfigValue(value != null ? value.trim() : "");
        config.setUpdatedAt(Instant.now());
        SystemConfig saved = systemConfigRepository.save(config);

        String detail;
        if ("GEMINI_API_KEY".equalsIgnoreCase(key)) {
            detail = "Updated Google Gemini API Key";
        } else if ("GROQ_API_KEY".equalsIgnoreCase(key)) {
            detail = "Updated GroqCloud (Meta Llama 3.3) API Key";
        } else if ("MISTRAL_API_KEY".equalsIgnoreCase(key)) {
            detail = "Updated Mistral AI API Key";
        } else {
            detail = "Updated " + key + " from '" + oldValue + "' to '" + value + "'";
        }

        auditLogService.log(
                "CONFIG_UPDATED",
                adminActor.getEmail(),
                adminActor.getRole().name(),
                "System Config: " + key,
                detail
        );

        return new SystemConfigDto(saved.getConfigKey(), saved.getConfigValue(), saved.getDescription(), saved.getUpdatedAt());
    }

    public SystemTelemetryDto getSystemTelemetry() {
        Runtime rt = Runtime.getRuntime();
        long mb = 1024 * 1024;
        long totalMem = rt.totalMemory() / mb;
        long freeMem = rt.freeMemory() / mb;
        long usedMem = totalMem - freeMem;
        long maxMem = rt.maxMemory() / mb;

        long uptimeSec = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;
        long uploadedCvs = cvDocumentRepository.count();

        String activeAiEngine = "MULTI-PROVIDER";

        return new SystemTelemetryDto(
                "CONNECTED",
                totalMem,
                freeMem,
                usedMem,
                maxMem,
                System.getProperty("java.version"),
                System.getProperty("os.name") + " (" + System.getProperty("os.arch") + ")",
                activeAiEngine,
                uptimeSec,
                uploadedCvs
        );
    }

    public List<AuditLogDto> getAuditLogs() {
        return auditLogService.getRecentLogs().stream().map(log ->
                new AuditLogDto(
                        log.getId(),
                        log.getAction(),
                        log.getActorEmail(),
                        log.getActorRole(),
                        log.getTargetResource(),
                        log.getDetails(),
                        log.getCreatedAt()
                )
        ).collect(Collectors.toList());
    }

    private AdminUserDto mapToAdminUserDto(User user) {
        String displayName = user.getEmail();
        String subDetails = "";

        if (user.getRole() == Role.CANDIDATE) {
            var cpOpt = candidateProfileRepository.findByUserId(user.getId());
            if (cpOpt.isPresent()) {
                var cp = cpOpt.get();
                displayName = cp.getFirstName() + " " + cp.getLastName();
                subDetails = cp.getTitle() != null && !cp.getTitle().isBlank() ? cp.getTitle() : "Candidate";
                if (cp.getSkills() != null && !cp.getSkills().isBlank()) {
                    subDetails += " • Skills: " + cp.getSkills();
                }
            } else {
                displayName = "Candidate";
            }
        } else if (user.getRole() == Role.RECRUITER) {
            var rpOpt = recruiterProfileRepository.findByUserId(user.getId());
            if (rpOpt.isPresent()) {
                var rp = rpOpt.get();
                displayName = rp.getCompanyName();
                subDetails = rp.getLocation() != null && !rp.getLocation().isBlank() ? rp.getLocation() : "Hiring Company";
            } else {
                displayName = "Recruiter";
            }
        } else if (user.getRole() == Role.ADMIN) {
            displayName = "System Administrator";
            subDetails = "Platform Operations & Governance";
        }

        return new AdminUserDto(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                displayName,
                subDetails,
                user.getCreatedAt()
        );
    }

    private JobOfferDto mapToJobDto(JobOffer job) {
        JobOfferDto dto = new JobOfferDto();
        dto.setId(job.getId());
        dto.setRecruiterId(job.getRecruiter().getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setCompanyName(job.getCompanyName());
        dto.setLocation(job.getLocation());
        dto.setEmploymentType(job.getEmploymentType());
        dto.setWorkplaceType(job.getWorkplaceType() != null ? job.getWorkplaceType() : WorkplaceType.ON_SITE);
        dto.setExperienceLevel(job.getExperienceLevel());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setMatchThreshold(job.getMatchThreshold() != null ? job.getMatchThreshold() : 70);
        dto.setStatus(job.getStatus());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setUpdatedAt(job.getUpdatedAt());

        long count = applicationRepository.findByJobOfferIdOrderByCreatedAtDesc(job.getId()).size();
        dto.setApplicantCount(count);

        return dto;
    }

    /**
     * Retrieves all skills from database, filtered by recent by default,
     * with optional search query and custom sorting options.
     */
    public List<SkillDto> getAllSkills(String query, String sortType) {
        return getAllSkills(query, null, sortType);
    }

    public List<SkillDto> getAllSkills(String query, String category, String sortType) {
        Sort sort;
        if ("name_asc".equalsIgnoreCase(sortType)) {
            sort = Sort.by(Sort.Direction.ASC, "name");
        } else if ("name_desc".equalsIgnoreCase(sortType)) {
            sort = Sort.by(Sort.Direction.DESC, "name");
        } else if ("oldest".equalsIgnoreCase(sortType)) {
            sort = Sort.by(Sort.Direction.ASC, "createdAt");
        } else {
            // Default: most recent skills first
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        List<Skill> list;
        boolean hasQuery = query != null && !query.trim().isEmpty();
        boolean hasCategory = category != null && !category.trim().isEmpty() && !"all".equalsIgnoreCase(category.trim());

        if (hasQuery && hasCategory) {
            list = skillRepository.findByNameContainingIgnoreCaseAndCategoryIgnoreCase(query.trim(), category.trim(), sort);
        } else if (hasQuery) {
            list = skillRepository.findByNameContainingIgnoreCase(query.trim(), sort);
        } else if (hasCategory) {
            list = skillRepository.findByCategoryIgnoreCase(category.trim(), sort);
        } else {
            list = skillRepository.findAll(sort);
        }

        return list.stream().map(this::mapSkillToDto).collect(Collectors.toList());
    }

    /**
     * Admin creates a new skill in the permanent database registry.
     */
    @Transactional
    public SkillDto createSkill(User admin, SkillRequest request) {
        String name = request.getName().trim();
        String normalized = name.toLowerCase();

        if (skillRepository.existsByNormalizedName(normalized)) {
            throw new DuplicateResourceException("Skill '" + name + "' already exists in the permanent database registry");
        }

        String category = request.getCategory() != null && !request.getCategory().trim().isEmpty() 
                ? request.getCategory().trim() 
                : "General";

        Skill skill = new Skill(name, normalized, category);
        Skill saved = skillRepository.save(skill);

        auditLogService.log("SKILL_CREATE", admin.getEmail(), admin.getRole().name(), "Skill", "Added new skill: " + saved.getName() + " (" + category + ")");
        return mapSkillToDto(saved);
    }

    /**
     * Admin modifies an existing skill.
     */
    @Transactional
    public SkillDto updateSkill(User admin, Long id, SkillRequest request) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

        String newName = request.getName().trim();
        String normalized = newName.toLowerCase();

        if (skillRepository.existsByNormalizedNameAndIdNot(normalized, id)) {
            throw new DuplicateResourceException("Another skill named '" + newName + "' already exists in the database");
        }

        String oldName = skill.getName();
        skill.setName(newName);
        skill.setNormalizedName(normalized);

        if (request.getCategory() != null) {
            String category = request.getCategory().trim();
            skill.setCategory(category.isEmpty() ? "General" : category);
        }

        Skill saved = skillRepository.save(skill);
        auditLogService.log("SKILL_UPDATE", admin.getEmail(), admin.getRole().name(), "Skill", "Updated skill id " + id + " from '" + oldName + "' to '" + saved.getName() + "'");
        return mapSkillToDto(saved);
    }

    /**
     * Admin removes a skill from the database.
     */
    @Transactional
    public void deleteSkill(User admin, Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

        String skillName = skill.getName();
        skillRepository.delete(skill);

        auditLogService.log("SKILL_DELETE", admin.getEmail(), admin.getRole().name(), "Skill", "Permanently removed skill '" + skillName + "' (ID: " + id + ")");
    }

    private SkillDto mapSkillToDto(Skill skill) {
        return new SkillDto(skill.getId(), skill.getName(), skill.getNormalizedName(), skill.getCategory(), skill.getCreatedAt());
    }
}
