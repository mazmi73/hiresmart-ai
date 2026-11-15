package com.hiresmart.dto.response;

import com.hiresmart.entity.EmploymentType;
import com.hiresmart.entity.ExperienceLevel;
import com.hiresmart.entity.JobStatus;
import com.hiresmart.entity.WorkplaceType;

import java.time.Instant;

public class JobOfferDto {

    private Long id;
    private Long recruiterId;
    private String title;
    private String description;
    private String companyName;
    private String location;
    private EmploymentType employmentType;
    private WorkplaceType workplaceType;
    private ExperienceLevel experienceLevel;
    private String requiredSkills;
    private JobStatus status;
    private Instant createdAt;
    private Instant updatedAt;
    private long applicantCount;
    private Integer matchThreshold;

    public JobOfferDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRecruiterId() {
        return recruiterId;
    }

    public void setRecruiterId(Long recruiterId) {
        this.recruiterId = recruiterId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public EmploymentType getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(EmploymentType employmentType) {
        this.employmentType = employmentType;
    }

    public ExperienceLevel getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(ExperienceLevel experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
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

    public long getApplicantCount() {
        return applicantCount;
    }

    public void setApplicantCount(long applicantCount) {
        this.applicantCount = applicantCount;
    }

    public Integer getMatchThreshold() {
        return matchThreshold != null ? matchThreshold : 70;
    }

    public void setMatchThreshold(Integer matchThreshold) {
        this.matchThreshold = matchThreshold != null ? matchThreshold : 70;
    }

    public WorkplaceType getWorkplaceType() {
        return workplaceType != null ? workplaceType : WorkplaceType.ON_SITE;
    }

    public void setWorkplaceType(WorkplaceType workplaceType) {
        this.workplaceType = workplaceType;
    }
}
