package com.hiresmart.dto.response;

import com.hiresmart.entity.ApplicationStatus;

import java.time.Instant;

public class ApplicationDto {

    private Long id;
    private Long jobOfferId;
    private String jobTitle;
    private String companyName;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String candidateTitle;
    private String candidateSkills;
    private Long cvDocumentId;
    private String cvOriginalName;
    private ApplicationStatus status;
    private String coverLetter;
    private Instant createdAt;
    private Instant updatedAt;
    private boolean hasAnalysis;
    private Double matchPercentage;
    private String matchedSkills;
    private String missingSkills;
    private Integer matchThreshold;

    public ApplicationDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobOfferId() {
        return jobOfferId;
    }

    public void setJobOfferId(Long jobOfferId) {
        this.jobOfferId = jobOfferId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getCandidateTitle() {
        return candidateTitle;
    }

    public void setCandidateTitle(String candidateTitle) {
        this.candidateTitle = candidateTitle;
    }

    public String getCandidateSkills() {
        return candidateSkills;
    }

    public void setCandidateSkills(String candidateSkills) {
        this.candidateSkills = candidateSkills;
    }

    public Long getCvDocumentId() {
        return cvDocumentId;
    }

    public void setCvDocumentId(Long cvDocumentId) {
        this.cvDocumentId = cvDocumentId;
    }

    public String getCvOriginalName() {
        return cvOriginalName;
    }

    public void setCvOriginalName(String cvOriginalName) {
        this.cvOriginalName = cvOriginalName;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isHasAnalysis() {
        return hasAnalysis;
    }

    public void setHasAnalysis(boolean hasAnalysis) {
        this.hasAnalysis = hasAnalysis;
    }

    public Double getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(Double matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public String getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(String matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public String getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(String missingSkills) {
        this.missingSkills = missingSkills;
    }

    public Integer getMatchThreshold() {
        return matchThreshold != null ? matchThreshold : 70;
    }

    public void setMatchThreshold(Integer matchThreshold) {
        this.matchThreshold = matchThreshold != null ? matchThreshold : 70;
    }
}
