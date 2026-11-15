package com.hiresmart.controller;

import com.hiresmart.dto.request.JobOfferRequest;
import com.hiresmart.dto.request.JobStatusUpdateRequest;
import com.hiresmart.dto.response.ApiResponse;
import com.hiresmart.dto.response.ApplicationDto;
import com.hiresmart.dto.response.JobOfferDto;
import com.hiresmart.entity.EmploymentType;
import com.hiresmart.entity.ExperienceLevel;
import com.hiresmart.entity.WorkplaceType;
import com.hiresmart.entity.User;
import com.hiresmart.repository.UserRepository;
import com.hiresmart.security.SecurityUtils;
import com.hiresmart.service.ApplicationService;
import com.hiresmart.service.JobOfferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Job Offers", description = "Public browsing and recruiter job management endpoints")
public class JobOfferController {

    private final JobOfferService jobOfferService;
    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    public JobOfferController(JobOfferService jobOfferService,
                              ApplicationService applicationService,
                              UserRepository userRepository) {
        this.jobOfferService = jobOfferService;
        this.applicationService = applicationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @Operation(summary = "Search and filter active job postings with pagination")
    public ResponseEntity<Page<JobOfferDto>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) WorkplaceType workplaceType,
            @RequestParam(required = false) ExperienceLevel experienceLevel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<JobOfferDto> results = jobOfferService.searchJobs(keyword, location, employmentType, workplaceType, experienceLevel, page, size);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/all")
    @Operation(summary = "List all active job offers without pagination")
    public ResponseEntity<List<JobOfferDto>> getAllActiveJobs() {
        return ResponseEntity.ok(jobOfferService.getAllActiveJobs());
    }

    @GetMapping("/skills")
    @Operation(summary = "Get list of distinct skills dynamically aggregated from database job offers, candidate profiles, and dictionary")
    public ResponseEntity<List<String>> getSkills(@RequestParam(required = false) String query) {
        List<String> skills = jobOfferService.getAllKnownSkills(query);
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Retrieve specific job offer details")
    public ResponseEntity<JobOfferDto> getJobById(@PathVariable Long id) {
        JobOfferDto dto = jobOfferService.getJobById(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    @Operation(summary = "Create a new job offer (Recruiter only)")
    public ResponseEntity<JobOfferDto> createJob(@Valid @RequestBody JobOfferRequest request) {
        User recruiter = SecurityUtils.getCurrentUser(userRepository);
        JobOfferDto dto = jobOfferService.createJob(recruiter, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing job offer (Recruiter only)")
    public ResponseEntity<JobOfferDto> updateJob(@PathVariable Long id, @Valid @RequestBody JobOfferRequest request) {
        User recruiter = SecurityUtils.getCurrentUser(userRepository);
        JobOfferDto dto = jobOfferService.updateJob(recruiter, id, request);
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Activate or close a job offer (Recruiter only)")
    public ResponseEntity<JobOfferDto> updateJobStatus(@PathVariable Long id, @Valid @RequestBody JobStatusUpdateRequest request) {
        User recruiter = SecurityUtils.getCurrentUser(userRepository);
        JobOfferDto dto = jobOfferService.updateJobStatus(recruiter, id, request.getStatus());
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/{id}/threshold")
    @Operation(summary = "Adjust high compatibility match threshold for a job offer (Recruiter only)")
    public ResponseEntity<JobOfferDto> updateJobThreshold(@PathVariable Long id, @RequestBody java.util.Map<String, Integer> request) {
        User recruiter = SecurityUtils.getCurrentUser(userRepository);
        Integer threshold = request.get("matchThreshold");
        JobOfferDto dto = jobOfferService.updateJobThreshold(recruiter, id, threshold);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a job offer (Recruiter only)")
    public ResponseEntity<ApiResponse> deleteJob(@PathVariable Long id) {
        User recruiter = SecurityUtils.getCurrentUser(userRepository);
        jobOfferService.deleteJob(recruiter, id);
        return ResponseEntity.ok(ApiResponse.ok("Job offer successfully deleted"));
    }

    @PostMapping(value = "/{id}/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Submit an application with CV to a job offer (Candidate only)")
    public ResponseEntity<ApplicationDto> applyWithUpload(
            @PathVariable Long id,
            @RequestParam(required = false) String coverLetter,
            @RequestPart(value = "cvFile", required = false) MultipartFile cvFile,
            @RequestParam(required = false) Long cvDocumentId
    ) {
        User candidate = SecurityUtils.getCurrentUser(userRepository);
        ApplicationDto dto = applicationService.applyToJob(candidate, id, coverLetter, cvFile, cvDocumentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PostMapping("/{id}/apply-saved")
    @Operation(summary = "Apply to job using candidate's already uploaded profile CV")
    public ResponseEntity<ApplicationDto> applyWithSavedCv(
            @PathVariable Long id,
            @RequestParam(required = false) String coverLetter,
            @RequestParam(required = false) Long cvDocumentId
    ) {
        User candidate = SecurityUtils.getCurrentUser(userRepository);
        ApplicationDto dto = applicationService.applyToJob(candidate, id, coverLetter, null, cvDocumentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
}
