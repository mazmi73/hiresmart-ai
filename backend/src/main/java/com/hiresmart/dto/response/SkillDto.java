package com.hiresmart.dto.response;

import java.time.Instant;

public class SkillDto {

    private Long id;
    private String name;
    private String normalizedName;
    private String category;
    private Instant createdAt;

    public SkillDto() {
    }

    public SkillDto(Long id, String name, String normalizedName, String category, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.normalizedName = normalizedName;
        this.category = category;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNormalizedName() {
        return normalizedName;
    }

    public void setNormalizedName(String normalizedName) {
        this.normalizedName = normalizedName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
