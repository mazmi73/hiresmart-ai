package com.hiresmart.exception;

import java.time.Instant;
import java.util.Map;

public class ErrorResponse {

    private int status;
    private String message;
    private Instant timestamp = Instant.now();
    private Map<String, String> validationErrors;

    public ErrorResponse() {
    }

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = Instant.now();
    }

    public ErrorResponse(int status, String message, Map<String, String> validationErrors) {
        this.status = status;
        this.message = message;
        this.validationErrors = validationErrors;
        this.timestamp = Instant.now();
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Map<String, String> getValidationErrors() {
        return validationErrors;
    }

    public void setValidationErrors(Map<String, String> validationErrors) {
        this.validationErrors = validationErrors;
    }
}
