package com.hiresmart.dto.request;

import com.hiresmart.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class ApplicationStatusUpdateRequest {

    @NotNull(message = "Status is required (SUBMITTED, UNDER_REVIEW, INTERVIEW, ACCEPTED, REJECTED)")
    private ApplicationStatus status;

    public ApplicationStatusUpdateRequest() {
    }

    public ApplicationStatusUpdateRequest(ApplicationStatus status) {
        this.status = status;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
