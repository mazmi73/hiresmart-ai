package com.hiresmart.dto.response;

public class SystemTelemetryDto {

    private String dbStatus;
    private long jvmTotalMemoryMb;
    private long jvmFreeMemoryMb;
    private long jvmUsedMemoryMb;
    private long jvmMaxMemoryMb;
    private String javaVersion;
    private String osName;
    private String activeAiEngine;
    private long uptimeSeconds;
    private long uploadedCvsCount;

    public SystemTelemetryDto() {
    }

    public SystemTelemetryDto(String dbStatus, long jvmTotalMemoryMb, long jvmFreeMemoryMb,
                              long jvmUsedMemoryMb, long jvmMaxMemoryMb, String javaVersion,
                              String osName, String activeAiEngine, long uptimeSeconds,
                              long uploadedCvsCount) {
        this.dbStatus = dbStatus;
        this.jvmTotalMemoryMb = jvmTotalMemoryMb;
        this.jvmFreeMemoryMb = jvmFreeMemoryMb;
        this.jvmUsedMemoryMb = jvmUsedMemoryMb;
        this.jvmMaxMemoryMb = jvmMaxMemoryMb;
        this.javaVersion = javaVersion;
        this.osName = osName;
        this.activeAiEngine = activeAiEngine;
        this.uptimeSeconds = uptimeSeconds;
        this.uploadedCvsCount = uploadedCvsCount;
    }

    public String getDbStatus() {
        return dbStatus;
    }

    public void setDbStatus(String dbStatus) {
        this.dbStatus = dbStatus;
    }

    public long getJvmTotalMemoryMb() {
        return jvmTotalMemoryMb;
    }

    public void setJvmTotalMemoryMb(long jvmTotalMemoryMb) {
        this.jvmTotalMemoryMb = jvmTotalMemoryMb;
    }

    public long getJvmFreeMemoryMb() {
        return jvmFreeMemoryMb;
    }

    public void setJvmFreeMemoryMb(long jvmFreeMemoryMb) {
        this.jvmFreeMemoryMb = jvmFreeMemoryMb;
    }

    public long getJvmUsedMemoryMb() {
        return jvmUsedMemoryMb;
    }

    public void setJvmUsedMemoryMb(long jvmUsedMemoryMb) {
        this.jvmUsedMemoryMb = jvmUsedMemoryMb;
    }

    public long getJvmMaxMemoryMb() {
        return jvmMaxMemoryMb;
    }

    public void setJvmMaxMemoryMb(long jvmMaxMemoryMb) {
        this.jvmMaxMemoryMb = jvmMaxMemoryMb;
    }

    public String getJavaVersion() {
        return javaVersion;
    }

    public void setJavaVersion(String javaVersion) {
        this.javaVersion = javaVersion;
    }

    public String getOsName() {
        return osName;
    }

    public void setOsName(String osName) {
        this.osName = osName;
    }

    public String getActiveAiEngine() {
        return activeAiEngine;
    }

    public void setActiveAiEngine(String activeAiEngine) {
        this.activeAiEngine = activeAiEngine;
    }

    public long getUptimeSeconds() {
        return uptimeSeconds;
    }

    public void setUptimeSeconds(long uptimeSeconds) {
        this.uptimeSeconds = uptimeSeconds;
    }

    public long getUploadedCvsCount() {
        return uploadedCvsCount;
    }

    public void setUploadedCvsCount(long uploadedCvsCount) {
        this.uploadedCvsCount = uploadedCvsCount;
    }
}
