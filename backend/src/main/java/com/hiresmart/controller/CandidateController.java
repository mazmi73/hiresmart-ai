package com.hiresmart.controller;

import com.hiresmart.dto.request.CandidateProfileRequest;
import com.hiresmart.dto.response.ApplicationDto;
import com.hiresmart.dto.response.CandidateProfileDto;
import com.hiresmart.entity.CVDocument;
import com.hiresmart.entity.User;
import com.hiresmart.exception.BadRequestException;
import com.hiresmart.repository.CVDocumentRepository;
import com.hiresmart.repository.UserRepository;
import com.hiresmart.security.SecurityUtils;
import com.hiresmart.service.ApplicationService;
import com.hiresmart.service.CandidateProfileService;
import com.hiresmart.service.CvStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@Tag(name = "Candidate", description = "Candidate profile management, CV uploads, and applications")
public class CandidateController {

    private final CandidateProfileService candidateProfileService;
    private final CvStorageService cvStorageService;
    private final CVDocumentRepository cvDocumentRepository;
    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    public CandidateController(CandidateProfileService candidateProfileService,
                               CvStorageService cvStorageService,
                               CVDocumentRepository cvDocumentRepository,
                               ApplicationService applicationService,
                               UserRepository userRepository) {
        this.candidateProfileService = candidateProfileService;
        this.cvStorageService = cvStorageService;
        this.cvDocumentRepository = cvDocumentRepository;
        this.applicationService = applicationService;
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get candidate profile details")
    public ResponseEntity<CandidateProfileDto> getProfile() {
        User candidate = SecurityUtils.getCurrentUser(userRepository);
        CandidateProfileDto dto = candidateProfileService.getProfile(candidate);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update candidate profile")
    public ResponseEntity<CandidateProfileDto> updateProfile(@Valid @RequestBody CandidateProfileRequest request) {
        User candidate = SecurityUtils.getCurrentUser(userRepository);
        CandidateProfileDto dto = candidateProfileService.updateProfile(candidate, request);
        return ResponseEntity.ok(dto);
    }

    @PostMapping(value = "/cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload candidate PDF CV with automatic text extraction")
    public ResponseEntity<CandidateProfileDto> uploadCv(@RequestPart("file") MultipartFile file) {
        User candidate = SecurityUtils.getCurrentUser(userRepository);
        cvStorageService.storeCv(candidate, file);
        CandidateProfileDto dto = candidateProfileService.getProfile(candidate);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/cv/download")
    @Operation(summary = "Download candidate's own uploaded CV file")
    public ResponseEntity<Resource> downloadMyCv() {
        User candidate = SecurityUtils.getCurrentUser(userRepository);
        CVDocument cvDocument = cvDocumentRepository.findTopByCandidateIdOrderByCreatedAtDesc(candidate.getId())
                .orElseThrow(() -> new BadRequestException("No CV document found for this account"));

        Resource resource = cvStorageService.loadCvAsResource(cvDocument);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + cvDocument.getOriginalFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/applications")
    @Operation(summary = "List all applications submitted by candidate")
    public ResponseEntity<List<ApplicationDto>> getMyApplications() {
        User candidate = SecurityUtils.getCurrentUser(userRepository);
        List<ApplicationDto> applications = applicationService.getCandidateApplications(candidate);
        return ResponseEntity.ok(applications);
    }
}
