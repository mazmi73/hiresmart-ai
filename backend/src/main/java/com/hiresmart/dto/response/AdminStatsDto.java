package com.hiresmart.dto.response;

public class AdminStatsDto {

    private long totalUsers;
    private long totalCandidates;
    private long totalRecruiters;
    private long totalAdmins;
    private long totalJobOffers;
    private long activeJobOffers;
    private long closedJobOffers;
    private long totalApplications;
    private long totalAnalyzedApplications;
    private double averageMatchScore;
    private long totalSkills;

    public AdminStatsDto() {
    }

    public AdminStatsDto(long totalUsers, long totalCandidates, long totalRecruiters, long totalAdmins,
                         long totalJobOffers, long activeJobOffers, long closedJobOffers,
                         long totalApplications, long totalAnalyzedApplications, double averageMatchScore) {
        this.totalUsers = totalUsers;
        this.totalCandidates = totalCandidates;
        this.totalRecruiters = totalRecruiters;
        this.totalAdmins = totalAdmins;
        this.totalJobOffers = totalJobOffers;
        this.activeJobOffers = activeJobOffers;
        this.closedJobOffers = closedJobOffers;
        this.totalApplications = totalApplications;
        this.totalAnalyzedApplications = totalAnalyzedApplications;
        this.averageMatchScore = averageMatchScore;
    }

    public AdminStatsDto(long totalUsers, long totalCandidates, long totalRecruiters, long totalAdmins,
                         long totalJobOffers, long activeJobOffers, long closedJobOffers,
                         long totalApplications, long totalAnalyzedApplications, double averageMatchScore,
                         long totalSkills) {
        this(totalUsers, totalCandidates, totalRecruiters, totalAdmins, totalJobOffers, activeJobOffers, closedJobOffers,
             totalApplications, totalAnalyzedApplications, averageMatchScore);
        this.totalSkills = totalSkills;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCandidates() {
        return totalCandidates;
    }

    public void setTotalCandidates(long totalCandidates) {
        this.totalCandidates = totalCandidates;
    }

    public long getTotalRecruiters() {
        return totalRecruiters;
    }

    public void setTotalRecruiters(long totalRecruiters) {
        this.totalRecruiters = totalRecruiters;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public long getTotalJobOffers() {
        return totalJobOffers;
    }

    public void setTotalJobOffers(long totalJobOffers) {
        this.totalJobOffers = totalJobOffers;
    }

    public long getActiveJobOffers() {
        return activeJobOffers;
    }

    public void setActiveJobOffers(long activeJobOffers) {
        this.activeJobOffers = activeJobOffers;
    }

    public long getClosedJobOffers() {
        return closedJobOffers;
    }

    public void setClosedJobOffers(long closedJobOffers) {
        this.closedJobOffers = closedJobOffers;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getTotalAnalyzedApplications() {
        return totalAnalyzedApplications;
    }

    public void setTotalAnalyzedApplications(long totalAnalyzedApplications) {
        this.totalAnalyzedApplications = totalAnalyzedApplications;
    }

    public double getAverageMatchScore() {
        return averageMatchScore;
    }

    public void setAverageMatchScore(double averageMatchScore) {
        this.averageMatchScore = averageMatchScore;
    }

    public long getTotalSkills() {
        return totalSkills;
    }

    public void setTotalSkills(long totalSkills) {
        this.totalSkills = totalSkills;
    }
}
