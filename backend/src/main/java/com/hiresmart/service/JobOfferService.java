package com.hiresmart.service;

import com.hiresmart.dto.request.JobOfferRequest;
import com.hiresmart.dto.response.JobOfferDto;
import com.hiresmart.entity.*;
import com.hiresmart.exception.ResourceNotFoundException;
import com.hiresmart.exception.UnauthorizedException;
import com.hiresmart.repository.ApplicationRepository;
import com.hiresmart.repository.CandidateProfileRepository;
import com.hiresmart.repository.JobOfferRepository;
import com.hiresmart.repository.RecruiterProfileRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private final ApplicationRepository applicationRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final SkillMatchingService skillMatchingService;
    private final SkillService skillService;
    private final AuditLogService auditLogService;

    public JobOfferService(JobOfferRepository jobOfferRepository,
                           ApplicationRepository applicationRepository,
                           RecruiterProfileRepository recruiterProfileRepository,
                           CandidateProfileRepository candidateProfileRepository,
                           SkillMatchingService skillMatchingService,
                           SkillService skillService,
                           AuditLogService auditLogService) {
        this.jobOfferRepository = jobOfferRepository;
        this.applicationRepository = applicationRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.skillMatchingService = skillMatchingService;
        this.skillService = skillService;
        this.auditLogService = auditLogService;
    }

    public Page<JobOfferDto> searchJobs(String keyword,
                                        String location,
                                        EmploymentType employmentType,
                                        WorkplaceType workplaceType,
                                        ExperienceLevel experienceLevel,
                                        int page,
                                        int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Specification<JobOffer> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), JobStatus.ACTIVE));

            if (keyword != null && !keyword.isBlank()) {
                String trimmed = keyword.trim().toLowerCase();
                String pattern = "%" + trimmed + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                Predicate companyMatch = cb.like(cb.lower(root.get("companyName")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                Predicate skillsMatch = cb.like(cb.lower(root.get("requiredSkills")), pattern);

                List<Predicate> keywordOrs = new ArrayList<>();
                keywordOrs.add(titleMatch);
                keywordOrs.add(companyMatch);
                keywordOrs.add(descMatch);
                keywordOrs.add(skillsMatch);

                if (trimmed.contains("remote")) {
                    keywordOrs.add(cb.equal(root.get("workplaceType"), WorkplaceType.REMOTE));
                }
                if (trimmed.contains("hybrid")) {
                    keywordOrs.add(cb.equal(root.get("workplaceType"), WorkplaceType.HYBRID));
                }
                if (trimmed.contains("on-site") || trimmed.contains("onsite") || trimmed.contains("on site")) {
                    keywordOrs.add(cb.equal(root.get("workplaceType"), WorkplaceType.ON_SITE));
                }

                predicates.add(cb.or(keywordOrs.toArray(new Predicate[0])));
            }

            if (location != null && !location.isBlank()) {
                String locPattern = "%" + location.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("location")), locPattern));
            }

            if (employmentType != null) {
                predicates.add(cb.equal(root.get("employmentType"), employmentType));
            }

            if (workplaceType != null) {
                predicates.add(cb.equal(root.get("workplaceType"), workplaceType));
            }

            if (experienceLevel != null) {
                predicates.add(cb.equal(root.get("experienceLevel"), experienceLevel));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<JobOffer> jobOffers = jobOfferRepository.findAll(spec, pageable);
        return jobOffers.map(this::mapToDto);
    }

    public List<JobOfferDto> getAllActiveJobs() {
        return jobOfferRepository.findByStatusOrderByCreatedAtDesc(JobStatus.ACTIVE)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public JobOfferDto getJobById(Long id) {
        JobOffer jobOffer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job offer not found with id: " + id));
        return mapToDto(jobOffer);
    }

    public JobOffer getJobEntity(Long id) {
        return jobOfferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job offer not found with id: " + id));
    }

    public List<JobOfferDto> getRecruiterJobs(User recruiter) {
        return jobOfferRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiter.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobOfferDto createJob(User recruiter, JobOfferRequest request) {
        JobOffer jobOffer = new JobOffer();
        jobOffer.setRecruiter(recruiter);
        jobOffer.setTitle(request.getTitle().trim());
        jobOffer.setDescription(request.getDescription().trim());
        jobOffer.setLocation(request.getLocation().trim());
        jobOffer.setEmploymentType(request.getEmploymentType());
        jobOffer.setWorkplaceType(request.getWorkplaceType() != null ? request.getWorkplaceType() : WorkplaceType.ON_SITE);
        jobOffer.setExperienceLevel(request.getExperienceLevel());
        jobOffer.setRequiredSkills(request.getRequiredSkills().trim());
        jobOffer.setMatchThreshold(request.getMatchThreshold() != null ? request.getMatchThreshold() : 70);
        jobOffer.setStatus(JobStatus.ACTIVE);

        // Company name can default from recruiter profile if blank
        String companyName = request.getCompanyName();
        if (companyName == null || companyName.isBlank()) {
            companyName = recruiterProfileRepository.findByUserId(recruiter.getId())
                    .map(RecruiterProfile::getCompanyName)
                    .orElse("Enterprise Partner");
        }
        jobOffer.setCompanyName(companyName.trim());

        JobOffer saved = jobOfferRepository.save(jobOffer);
        if (request.getRequiredSkills() != null && !request.getRequiredSkills().isBlank()) {
            skillService.saveSkillsFromText(request.getRequiredSkills());
        }

        auditLogService.log(
                "JOB_CREATED",
                recruiter.getEmail(),
                recruiter.getRole().name(),
                "Job Offer #" + saved.getId(),
                saved.getTitle() + " job offer posted by " + saved.getCompanyName()
        );

        return mapToDto(saved);
    }

    @Transactional
    public JobOfferDto updateJob(User recruiter, Long id, JobOfferRequest request) {
        JobOffer job = getJobEntity(id);
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You are not authorized to edit this job posting");
        }

        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription().trim());
        job.setCompanyName(request.getCompanyName().trim());
        job.setLocation(request.getLocation().trim());
        job.setEmploymentType(request.getEmploymentType());
        if (request.getWorkplaceType() != null) {
            job.setWorkplaceType(request.getWorkplaceType());
        }
        job.setExperienceLevel(request.getExperienceLevel());
        job.setRequiredSkills(request.getRequiredSkills().trim());
        if (request.getMatchThreshold() != null) {
            job.setMatchThreshold(request.getMatchThreshold());
        }

        JobOffer saved = jobOfferRepository.save(job);
        if (request.getRequiredSkills() != null && !request.getRequiredSkills().isBlank()) {
            skillService.saveSkillsFromText(request.getRequiredSkills());
        }
        return mapToDto(saved);
    }

    @Transactional
    public JobOfferDto updateJobThreshold(User recruiter, Long id, Integer matchThreshold) {
        JobOffer job = getJobEntity(id);
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You are not authorized to modify threshold for this job posting");
        }

        if (matchThreshold == null || matchThreshold < 10 || matchThreshold > 100) {
            throw new com.hiresmart.exception.BadRequestException("Match threshold must be between 10% and 100%");
        }

        job.setMatchThreshold(matchThreshold);
        JobOffer saved = jobOfferRepository.save(job);
        return mapToDto(saved);
    }

    @Transactional
    public JobOfferDto updateJobStatus(User recruiter, Long id, JobStatus status) {
        JobOffer job = getJobEntity(id);
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You are not authorized to modify status for this job posting");
        }

        job.setStatus(status);
        JobOffer saved = jobOfferRepository.save(job);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteJob(User recruiter, Long id) {
        JobOffer job = getJobEntity(id);
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this job posting");
        }
        jobOfferRepository.delete(job);
    }

    private JobOfferDto mapToDto(JobOffer job) {
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
     * Retrieves all permanent skills from the database skills registry,
     * optionally filtered by query.
     */
    public List<String> getAllKnownSkills(String query) {
        return skillService.getSkills(query);
    }
}
