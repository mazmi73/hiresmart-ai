package com.hiresmart.service;

import com.hiresmart.dto.response.ApplicationDto;
import com.hiresmart.entity.*;
import com.hiresmart.exception.BadRequestException;
import com.hiresmart.exception.DuplicateResourceException;
import com.hiresmart.exception.ResourceNotFoundException;
import com.hiresmart.exception.UnauthorizedException;
import com.hiresmart.repository.ApplicationRepository;
import com.hiresmart.repository.CVAnalysisRepository;
import com.hiresmart.repository.CVDocumentRepository;
import com.hiresmart.repository.CandidateProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobOfferService jobOfferService;
    private final CVDocumentRepository cvDocumentRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CvStorageService cvStorageService;
    private final CVAnalysisRepository cvAnalysisRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobOfferService jobOfferService,
                              CVDocumentRepository cvDocumentRepository,
                              CandidateProfileRepository candidateProfileRepository,
                              CvStorageService cvStorageService,
                              CVAnalysisRepository cvAnalysisRepository) {
        this.applicationRepository = applicationRepository;
        this.jobOfferService = jobOfferService;
        this.cvDocumentRepository = cvDocumentRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.cvStorageService = cvStorageService;
        this.cvAnalysisRepository = cvAnalysisRepository;
    }

    @Transactional
    public ApplicationDto applyToJob(User candidate, Long jobOfferId, String coverLetter, MultipartFile optionalFile, Long cvDocumentId) {
        if (candidate.getRole() != Role.CANDIDATE) {
            throw new UnauthorizedException("Only candidates are permitted to submit job applications");
        }

        JobOffer job = jobOfferService.getJobEntity(jobOfferId);

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new BadRequestException("Cannot apply to a closed job offer");
        }

        if (applicationRepository.existsByJobOfferIdAndCandidateId(jobOfferId, candidate.getId())) {
            throw new DuplicateResourceException("You have already submitted an application to this job offer");
        }

        CVDocument cvDocument = null;
        if (optionalFile != null && !optionalFile.isEmpty()) {
            cvDocument = cvStorageService.storeCv(candidate, optionalFile);
        } else if (cvDocumentId != null) {
            cvDocument = cvDocumentRepository.findById(cvDocumentId)
                    .filter(doc -> doc.getCandidate().getId().equals(candidate.getId()))
                    .orElseThrow(() -> new BadRequestException("Selected CV document not found"));
        } else {
            // Pick candidate's latest uploaded CV
            cvDocument = cvDocumentRepository.findTopByCandidateIdOrderByCreatedAtDesc(candidate.getId())
                    .orElseThrow(() -> new BadRequestException("Please upload your PDF resume/CV before applying"));
        }

        Application application = new Application();
        application.setJobOffer(job);
        application.setCandidate(candidate);
        application.setCvDocument(cvDocument);
        application.setCoverLetter(coverLetter != null ? coverLetter.trim() : null);
        application.setStatus(ApplicationStatus.SUBMITTED);

        Application saved = applicationRepository.save(application);
        return mapToDto(saved);
    }

    public List<ApplicationDto> getCandidateApplications(User candidate) {
        return applicationRepository.findByCandidateIdOrderByCreatedAtDesc(candidate.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getRecruiterApplications(User recruiter, Long jobOfferId) {
        List<Application> apps;
        if (jobOfferId != null) {
            JobOffer job = jobOfferService.getJobEntity(jobOfferId);
            if (!job.getRecruiter().getId().equals(recruiter.getId())) {
                throw new UnauthorizedException("You are not authorized to view applications for this job offer");
            }
            apps = applicationRepository.findByJobOfferIdOrderByCreatedAtDesc(jobOfferId);
        } else {
            apps = applicationRepository.findByJobOfferRecruiterIdOrderByCreatedAtDesc(recruiter.getId());
        }

        return apps.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ApplicationDto getApplicationDetails(Long applicationId, User requester) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        boolean isRecruiter = app.getJobOffer().getRecruiter().getId().equals(requester.getId());
        boolean isCandidate = app.getCandidate().getId().equals(requester.getId());
        if (!isRecruiter && !isCandidate) {
            throw new UnauthorizedException("You are not authorized to view this application");
        }

        return mapToDto(app);
    }

    @Transactional
    public ApplicationDto updateApplicationStatus(User recruiter, Long applicationId, ApplicationStatus newStatus) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (!app.getJobOffer().getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You are not authorized to update this application status");
        }

        app.setStatus(newStatus);
        Application saved = applicationRepository.save(app);
        return mapToDto(saved);
    }

    public CVDocument getCvForApplication(Long applicationId, User requester) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        boolean isRecruiter = app.getJobOffer().getRecruiter().getId().equals(requester.getId());
        boolean isCandidate = app.getCandidate().getId().equals(requester.getId());
        if (!isRecruiter && !isCandidate) {
            throw new UnauthorizedException("You are not authorized to access this CV");
        }

        if (app.getCvDocument() == null) {
            throw new ResourceNotFoundException("No CV document attached to this application");
        }

        return app.getCvDocument();
    }

    private ApplicationDto mapToDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setJobOfferId(app.getJobOffer().getId());
        dto.setJobTitle(app.getJobOffer().getTitle());
        dto.setCompanyName(app.getJobOffer().getCompanyName());
        dto.setCandidateId(app.getCandidate().getId());
        dto.setCandidateEmail(app.getCandidate().getEmail());
        dto.setStatus(app.getStatus());
        dto.setCoverLetter(app.getCoverLetter());
        dto.setCreatedAt(app.getCreatedAt());
        dto.setUpdatedAt(app.getUpdatedAt());
        dto.setMatchThreshold(app.getJobOffer() != null && app.getJobOffer().getMatchThreshold() != null
                ? app.getJobOffer().getMatchThreshold() : 70);

        // Attach candidate name & profile snippet
        Optional<CandidateProfile> profileOpt = candidateProfileRepository.findByUserId(app.getCandidate().getId());
        if (profileOpt.isPresent()) {
            CandidateProfile cp = profileOpt.get();
            dto.setCandidateName(cp.getFirstName() + " " + cp.getLastName());
            dto.setCandidateTitle(cp.getTitle());
            dto.setCandidateSkills(cp.getSkills());
        } else {
            dto.setCandidateName(app.getCandidate().getEmail());
        }

        // CV details
        if (app.getCvDocument() != null) {
            dto.setCvDocumentId(app.getCvDocument().getId());
            dto.setCvOriginalName(app.getCvDocument().getOriginalFileName());
        }

        // Existing AI analysis summary if present
        Optional<CVAnalysis> analysisOpt = cvAnalysisRepository.findByApplication(app);
        if (analysisOpt.isPresent()) {
            CVAnalysis analysis = analysisOpt.get();
            dto.setHasAnalysis(true);
            dto.setMatchPercentage(analysis.getMatchPercentage());
            dto.setMatchedSkills(analysis.getMatchedSkills());
            dto.setMissingSkills(analysis.getMissingSkills());
        } else {
            dto.setHasAnalysis(false);
        }

        return dto;
    }
}
