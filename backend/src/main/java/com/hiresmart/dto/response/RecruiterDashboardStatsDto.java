package com.hiresmart.dto.response;

import java.util.List;

public class RecruiterDashboardStatsDto {

    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
    private long applicationsUnderReview;
    private List<ApplicationDto> recentApplications;

    public RecruiterDashboardStatsDto() {
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getActiveJobs() {
        return activeJobs;
    }

    public void setActiveJobs(long activeJobs) {
        this.activeJobs = activeJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getApplicationsUnderReview() {
        return applicationsUnderReview;
    }

    public void setApplicationsUnderReview(long applicationsUnderReview) {
        this.applicationsUnderReview = applicationsUnderReview;
    }

    public List<ApplicationDto> getRecentApplications() {
        return recentApplications;
    }

    public void setRecentApplications(List<ApplicationDto> recentApplications) {
        this.recentApplications = recentApplications;
    }
}
