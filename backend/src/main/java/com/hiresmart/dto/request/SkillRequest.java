package com.hiresmart.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SkillRequest {

    @NotBlank(message = "Skill name cannot be blank")
    @Size(max = 150, message = "Skill name cannot exceed 150 characters")
    private String name;

    @Size(max = 100, message = "Category cannot exceed 100 characters")
    private String category;

    public SkillRequest() {
    }

    public SkillRequest(String name, String category) {
        this.name = name;
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
