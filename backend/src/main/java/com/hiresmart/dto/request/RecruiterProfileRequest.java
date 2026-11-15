package com.hiresmart.dto.request;

import jakarta.validation.constraints.NotBlank;

public class RecruiterProfileRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String companyDescription;
    private String website;
    private String location;

    public RecruiterProfileRequest() {
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyDescription() {
        return companyDescription;
    }

    public void setCompanyDescription(String companyDescription) {
        this.companyDescription = companyDescription;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
