package com.hiresmart.dto.response;

import com.hiresmart.entity.Role;
import java.time.Instant;

public class AdminUserDto {

    private Long id;
    private String email;
    private Role role;
    private String displayName;
    private String subDetails;
    private Instant createdAt;

    public AdminUserDto() {
    }

    public AdminUserDto(Long id, String email, Role role, String displayName, String subDetails, Instant createdAt) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.displayName = displayName;
        this.subDetails = subDetails;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getSubDetails() {
        return subDetails;
    }

    public void setSubDetails(String subDetails) {
        this.subDetails = subDetails;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
