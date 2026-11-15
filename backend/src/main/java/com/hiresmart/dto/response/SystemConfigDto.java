package com.hiresmart.dto.response;

import java.time.Instant;

public class SystemConfigDto {

    private String configKey;
    private String configValue;
    private String description;
    private Instant updatedAt;

    public SystemConfigDto() {
    }

    public SystemConfigDto(String configKey, String configValue, String description, Instant updatedAt) {
        this.configKey = configKey;
        this.configValue = configValue;
        this.description = description;
        this.updatedAt = updatedAt;
    }

    public String getConfigKey() {
        return configKey;
    }

    public void setConfigKey(String configKey) {
        this.configKey = configKey;
    }

    public String getConfigValue() {
        return configValue;
    }

    public void setConfigValue(String configValue) {
        this.configValue = configValue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
