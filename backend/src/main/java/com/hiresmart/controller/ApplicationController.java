package com.hiresmart.controller;

import com.hiresmart.dto.request.ApplicationStatusUpdateRequest;
import com.hiresmart.dto.response.ApplicationDto;
import com.hiresmart.dto.response.CVAnalysisDto;
import com.hiresmart.entity.CVDocument;
import com.hiresmart.entity.User;
import com.hiresmart.repository.UserRepository;
import com.hiresmart.security.SecurityUtils;
import com.hiresmart.service.ApplicationService;
import com.hiresmart.service.CvAnalysisService;
import com.hiresmart.service.CvStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Applications", description = "Application reviews, status changes, CV downloads, and AI matching analysis")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final CvAnalysisService cvAnalysisService;
    private final CvStorageService cvStorageService;
    private final UserRepository userRepository;

    public ApplicationController(ApplicationService applicationService,
                                 CvAnalysisService cvAnalysisService,
                                 CvStorageService cvStorageService,
                                 UserRepository userRepository) {
        this.applicationService = applicationService;
        this.cvAnalysisService = cvAnalysisService;
        this.cvStorageService = cvStorageService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application details (Authorized Recruiter or Applicant Candidate)")
    public ResponseEntity<ApplicationDto> getApplicationDetails(@PathVariable Long id) {
        User user = SecurityUtils.getCurrentUser(userRepository);
        ApplicationDto dto = applicationService.getApplicationDetails(id, user);
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update application status (Recruiter only)")
    public ResponseEntity<ApplicationDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request
    ) {
        User recruiter = SecurityUtils.getCurrentUser(userRepository);
        ApplicationDto dto = applicationService.updateApplicationStatus(recruiter, id, request.getStatus());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}/cv/download")
    @Operation(summary = "Securely download application's uploaded CV PDF")
    public ResponseEntity<Resource> downloadApplicationCv(@PathVariable Long id) {
        User user = SecurityUtils.getCurrentUser(userRepository);
        CVDocument cvDocument = applicationService.getCvForApplication(id, user);
        Resource resource = cvStorageService.loadCvAsResource(cvDocument);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + cvDocument.getOriginalFileName() + "\"")
                .body(resource);
    }

    @PostMapping("/{id}/analyze")
    @Operation(summary = "Trigger AI CV skills matching against job requirements (Recruiter only)")
    public ResponseEntity<CVAnalysisDto> analyzeApplicationCv(
            @PathVariable Long id,
            @RequestParam(required = false) String engine
    ) {
        User user = SecurityUtils.getCurrentUser(userRepository);
        CVAnalysisDto analysis = cvAnalysisService.analyzeApplication(id, user, engine);
        return ResponseEntity.ok(analysis);
    }

    @GetMapping("/{id}/analysis")
    @Operation(summary = "Retrieve existing AI CV skills match analysis")
    public ResponseEntity<CVAnalysisDto> getApplicationAnalysis(@PathVariable Long id) {
        User user = SecurityUtils.getCurrentUser(userRepository);
        CVAnalysisDto analysis = cvAnalysisService.getAnalysisForApplication(id, user);
        return ResponseEntity.ok(analysis);
    }
}
