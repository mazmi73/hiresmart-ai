package com.hiresmart.dto.request;

public class ApplicationCreateRequest {

    private String coverLetter;
    private Long cvDocumentId;

    public ApplicationCreateRequest() {
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public Long getCvDocumentId() {
        return cvDocumentId;
    }

    public void setCvDocumentId(Long cvDocumentId) {
        this.cvDocumentId = cvDocumentId;
    }
}
