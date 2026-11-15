package com.hiresmart;

import com.hiresmart.dto.response.ApplicationDto;
import com.hiresmart.entity.*;
import com.hiresmart.exception.BadRequestException;
import com.hiresmart.exception.DuplicateResourceException;
import com.hiresmart.repository.ApplicationRepository;
import com.hiresmart.repository.CVAnalysisRepository;
import com.hiresmart.repository.CVDocumentRepository;
import com.hiresmart.repository.CandidateProfileRepository;
import com.hiresmart.service.ApplicationService;
import com.hiresmart.service.CvStorageService;
import com.hiresmart.service.JobOfferService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private JobOfferService jobOfferService;

    @Mock
    private CVDocumentRepository cvDocumentRepository;

    @Mock
    private CandidateProfileRepository candidateProfileRepository;

    @Mock
    private CvStorageService cvStorageService;

    @Mock
    private CVAnalysisRepository cvAnalysisRepository;

    private ApplicationService applicationService;

    @BeforeEach
    void setUp() {
        applicationService = new ApplicationService(
                applicationRepository,
                jobOfferService,
                cvDocumentRepository,
                candidateProfileRepository,
                cvStorageService,
                cvAnalysisRepository
        );
    }

    @Test
    @DisplayName("Should prevent candidate from applying twice to the same job offer")
    void testDuplicateApplicationPrevention() {
        User candidate = new User("candidate@hiresmart.ai", "pass", Role.CANDIDATE);
        candidate.setId(2L);

        JobOffer job = new JobOffer();
        job.setId(1L);
        job.setStatus(JobStatus.ACTIVE);

        when(jobOfferService.getJobEntity(1L)).thenReturn(job);
        when(applicationRepository.existsByJobOfferIdAndCandidateId(1L, 2L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () ->
                applicationService.applyToJob(candidate, 1L, "Cover letter", null, null)
        );
    }

    @Test
    @DisplayName("Should update application status when requested by job recruiter")
    void testUpdateApplicationStatusSuccess() {
        User recruiter = new User("recruiter@hiresmart.ai", "pass", Role.RECRUITER);
        recruiter.setId(1L);

        JobOffer job = new JobOffer();
        job.setId(1L);
        job.setRecruiter(recruiter);
        job.setTitle("Senior Full-Stack Engineer");
        job.setCompanyName("TechNova Innovations");

        User candidate = new User("candidate@hiresmart.ai", "pass", Role.CANDIDATE);
        candidate.setId(2L);

        Application application = new Application();
        application.setId(10L);
        application.setJobOffer(job);
        application.setCandidate(candidate);
        application.setStatus(ApplicationStatus.SUBMITTED);

        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenAnswer(i -> i.getArgument(0));

        ApplicationDto updated = applicationService.updateApplicationStatus(recruiter, 10L, ApplicationStatus.INTERVIEW);

        assertNotNull(updated);
        assertEquals(ApplicationStatus.INTERVIEW, updated.getStatus());
        verify(applicationRepository).save(application);
    }
}
