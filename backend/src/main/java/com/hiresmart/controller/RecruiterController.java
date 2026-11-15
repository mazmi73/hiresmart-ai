package com.hiresmart.controller;

import com.hiresmart.dto.request.RecruiterProfileRequest;
import com.hiresmart.dto.response.ApplicationDto;
import com.hiresmart.dto.response.JobOfferDto;
import com.hiresmart.dto.response.RecruiterDashboardStatsDto;
import com.hiresmart.dto.response.RecruiterProfileDto;
import com.hiresmart.entity.User;
import com.hiresmart.repository.UserRepository;
import com.hiresmart.security.SecurityUtils;
import com.hiresmart.service.ApplicationService;
import com.hiresmart.service.JobOfferService;
import com.hiresmart.service.RecruiterProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiters")
@Tag(name = "Recruiter", description = "Recruiter dashboard stats, profile, and job applications")
public class RecruiterController {

    private final RecruiterProfileService recruiterProfileService;
    private final JobOfferService jobOfferService;
    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    public RecruiterController(RecruiterProfileService recruiterProfileService,
                               JobOfferService jobOfferService,
                               ApplicationService applicationService,
                               UserRepository userRepository) {
        this.recruiterProfileService = recruiterProfileService;
        this.jobOfferService = jobOfferService;
        this.applicationService = applicationService;
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get recruiter company profile")
    public ResponseEntity<RecruiterProfileDto> getProfile() {
        User recruiter = SecurityUtils.getCurrentUser(userRepository);
        RecruiterProfileDto dto = recruiterProfileService.getProfile(recruiter);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update recruiter company profile")
    public ResponseEntity<RecruiterProfileDto> updateProfile(@Valid @RequestBody RecruiterProfileRequest request) {
        User recruiter = SecurityUtils.getCurrentUser(userRepository);
        RecruiterProfileDto dto = recruiterProfileService.updateProfile(recruiter, request);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/dashboard-stats")
    @Operation(summary = "Get recruiter analytics and dashboard statistics")
    public ResponseEntity<RecruiterDashboardStatsDto> getDashboardStats() {
        User recruiter = SecurityUtils.getCurrentUser(userRepository);
        RecruiterDashboardStatsDto stats = recruiterProfileService.getDashboardStats(recruiter);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/jobs")
    @Operation(summary = "Get all jobs posted by current recruiter")
    public ResponseEntity<List<JobOfferDto>> getMyJobs() {
        User recruiter = SecurityUtils.getCurrentUser(userRepository);
        List<JobOfferDto> jobs = jobOfferService.getRecruiterJobs(recruiter);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/jobs/{id}/applications")
    @Operation(summary = "Get all applications submitted to a specific recruiter job offer")
    public ResponseEntity<List<ApplicationDto>> getJobApplications(@PathVariable Long id) {
        User recruiter = SecurityUtils.getCurrentUser(userRepository);
        List<ApplicationDto> applications = applicationService.getRecruiterApplications(recruiter, id);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/applications")
    @Operation(summary = "Get all applications submitted to any job posted by current recruiter")
    public ResponseEntity<List<ApplicationDto>> getAllRecruiterApplications() {
        User recruiter = SecurityUtils.getCurrentUser(userRepository);
        List<ApplicationDto> applications = applicationService.getRecruiterApplications(recruiter, null);
        return ResponseEntity.ok(applications);
    }
}
