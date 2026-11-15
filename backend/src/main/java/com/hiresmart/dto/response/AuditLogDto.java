package com.hiresmart.dto.response;

import java.time.Instant;

public class AuditLogDto {

    private Long id;
    private String action;
    private String actorEmail;
    private String actorRole;
    private String targetResource;
    private String details;
    private Instant createdAt;

    public AuditLogDto() {
    }

    public AuditLogDto(Long id, String action, String actorEmail, String actorRole, String targetResource, String details, Instant createdAt) {
        this.id = id;
        this.action = action;
        this.actorEmail = actorEmail;
        this.actorRole = actorRole;
        this.targetResource = targetResource;
        this.details = details;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getActorEmail() {
        return actorEmail;
    }

    public void setActorEmail(String actorEmail) {
        this.actorEmail = actorEmail;
    }

    public String getActorRole() {
        return actorRole;
    }

    public void setActorRole(String actorRole) {
        this.actorRole = actorRole;
    }

    public String getTargetResource() {
        return targetResource;
    }

    public void setTargetResource(String targetResource) {
        this.targetResource = targetResource;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
