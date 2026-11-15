package com.hiresmart.service;

import com.hiresmart.dto.request.RecruiterProfileRequest;
import com.hiresmart.dto.response.ApplicationDto;
import com.hiresmart.dto.response.RecruiterDashboardStatsDto;
import com.hiresmart.dto.response.RecruiterProfileDto;
import com.hiresmart.entity.*;
import com.hiresmart.repository.ApplicationRepository;
import com.hiresmart.repository.JobOfferRepository;
import com.hiresmart.repository.RecruiterProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecruiterProfileService {

    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobOfferRepository jobOfferRepository;
    private final ApplicationRepository applicationRepository;
    private final com.hiresmart.repository.CVAnalysisRepository cvAnalysisRepository;

    public RecruiterProfileService(RecruiterProfileRepository recruiterProfileRepository,
                                   JobOfferRepository jobOfferRepository,
                                   ApplicationRepository applicationRepository,
                                   com.hiresmart.repository.CVAnalysisRepository cvAnalysisRepository) {
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.jobOfferRepository = jobOfferRepository;
        this.applicationRepository = applicationRepository;
        this.cvAnalysisRepository = cvAnalysisRepository;
    }

    public RecruiterProfileDto getProfile(User user) {
        RecruiterProfile profile = recruiterProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> recruiterProfileRepository.save(new RecruiterProfile(user, "Recruiter Company")));

        return mapToDto(profile, user.getEmail());
    }

    @Transactional
    public RecruiterProfileDto updateProfile(User user, RecruiterProfileRequest request) {
        RecruiterProfile profile = recruiterProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> new RecruiterProfile(user, request.getCompanyName()));

        profile.setCompanyName(request.getCompanyName());
        profile.setCompanyDescription(request.getCompanyDescription());
        profile.setWebsite(request.getWebsite());
        profile.setLocation(request.getLocation());

        RecruiterProfile saved = recruiterProfileRepository.save(profile);
        return mapToDto(saved, user.getEmail());
    }

    public RecruiterDashboardStatsDto getDashboardStats(User user) {
        long totalJobs = jobOfferRepository.countByRecruiterId(user.getId());
        long activeJobs = jobOfferRepository.countByRecruiterIdAndStatus(user.getId(), JobStatus.ACTIVE);
        long totalApplications = applicationRepository.countByJobOfferRecruiterId(user.getId());
        long applicationsUnderReview = applicationRepository.countByJobOfferRecruiterIdAndStatus(user.getId(), ApplicationStatus.UNDER_REVIEW);

        List<Application> recentApps = applicationRepository.findTop5ByJobOfferRecruiterIdOrderByCreatedAtDesc(user.getId());
        List<ApplicationDto> recentDtos = recentApps.stream().map(app -> {
            ApplicationDto dto = new ApplicationDto();
            dto.setId(app.getId());
            dto.setJobOfferId(app.getJobOffer().getId());
            dto.setJobTitle(app.getJobOffer().getTitle());
            dto.setCompanyName(app.getJobOffer().getCompanyName());
            dto.setCandidateId(app.getCandidate().getId());
            dto.setCandidateEmail(app.getCandidate().getEmail());
            dto.setStatus(app.getStatus());
            dto.setCreatedAt(app.getCreatedAt());
            dto.setUpdatedAt(app.getUpdatedAt());
            dto.setMatchThreshold(app.getJobOffer() != null && app.getJobOffer().getMatchThreshold() != null
                    ? app.getJobOffer().getMatchThreshold() : 70);

            if (app.getCvDocument() != null) {
                dto.setCvDocumentId(app.getCvDocument().getId());
                dto.setCvOriginalName(app.getCvDocument().getOriginalFileName());
            }

            cvAnalysisRepository.findByApplication(app).ifPresent(analysis -> {
                dto.setHasAnalysis(true);
                dto.setMatchPercentage(analysis.getMatchPercentage());
                dto.setMatchedSkills(analysis.getMatchedSkills());
                dto.setMissingSkills(analysis.getMissingSkills());
            });

            return dto;
        }).collect(Collectors.toList());

        RecruiterDashboardStatsDto stats = new RecruiterDashboardStatsDto();
        stats.setTotalJobs(totalJobs);
        stats.setActiveJobs(activeJobs);
        stats.setTotalApplications(totalApplications);
        stats.setApplicationsUnderReview(applicationsUnderReview);
        stats.setRecentApplications(recentDtos);
        return stats;
    }

    private RecruiterProfileDto mapToDto(RecruiterProfile profile, String email) {
        RecruiterProfileDto dto = new RecruiterProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser() != null ? profile.getUser().getId() : null);
        dto.setEmail(email);
        dto.setCompanyName(profile.getCompanyName());
        dto.setCompanyDescription(profile.getCompanyDescription());
        dto.setWebsite(profile.getWebsite());
        dto.setLocation(profile.getLocation());
        return dto;
    }
}
