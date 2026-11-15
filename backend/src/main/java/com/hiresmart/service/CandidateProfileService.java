package com.hiresmart.service;

import com.hiresmart.dto.request.CandidateProfileRequest;
import com.hiresmart.dto.response.CandidateProfileDto;
import com.hiresmart.entity.CVDocument;
import com.hiresmart.entity.CandidateProfile;
import com.hiresmart.entity.User;
import com.hiresmart.exception.ResourceNotFoundException;
import com.hiresmart.repository.CVDocumentRepository;
import com.hiresmart.repository.CandidateProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CandidateProfileService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final CVDocumentRepository cvDocumentRepository;

    public CandidateProfileService(CandidateProfileRepository candidateProfileRepository,
                                   CVDocumentRepository cvDocumentRepository) {
        this.candidateProfileRepository = candidateProfileRepository;
        this.cvDocumentRepository = cvDocumentRepository;
    }

    public CandidateProfileDto getProfile(User user) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> candidateProfileRepository.save(new CandidateProfile(user, "Candidate", "User")));

        return mapToDto(profile, user.getEmail());
    }

    @Transactional
    public CandidateProfileDto updateProfile(User user, CandidateProfileRequest request) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> new CandidateProfile(user, request.getFirstName(), request.getLastName()));

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhone(request.getPhone());
        profile.setTitle(request.getTitle());
        profile.setEducation(request.getEducation());
        profile.setExperienceSummary(request.getExperienceSummary());
        profile.setSkills(request.getSkills());

        CandidateProfile saved = candidateProfileRepository.save(profile);
        return mapToDto(saved, user.getEmail());
    }

    private CandidateProfileDto mapToDto(CandidateProfile profile, String email) {
        CandidateProfileDto dto = new CandidateProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser() != null ? profile.getUser().getId() : null);
        dto.setEmail(email);
        dto.setFirstName(profile.getFirstName());
        dto.setLastName(profile.getLastName());
        dto.setPhone(profile.getPhone());
        dto.setTitle(profile.getTitle());
        dto.setEducation(profile.getEducation());
        dto.setExperienceSummary(profile.getExperienceSummary());
        dto.setSkills(profile.getSkills());

        if (profile.getUser() != null) {
            Optional<CVDocument> latestCv = cvDocumentRepository.findTopByCandidateIdOrderByCreatedAtDesc(profile.getUser().getId());
            if (latestCv.isPresent()) {
                dto.setHasCv(true);
                dto.setCvId(latestCv.get().getId());
                dto.setCvOriginalName(latestCv.get().getOriginalFileName());
            } else {
                dto.setHasCv(false);
            }
        }

        return dto;
    }
}
