package com.hiresmart.service;

import com.hiresmart.entity.AuditLog;
import com.hiresmart.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private static final Logger logger = LoggerFactory.getLogger(AuditLogService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String action, String actorEmail, String actorRole, String targetResource, String details) {
        try {
            AuditLog auditLog = new AuditLog(action, actorEmail, actorRole, targetResource, details);
            auditLogRepository.save(auditLog);
            logger.info("AUDIT: [{}] by {} ({}) on {} - {}", action, actorEmail, actorRole, targetResource, details);
        } catch (Exception e) {
            logger.error("Failed to write audit log: {}", e.getMessage());
        }
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop1000ByOrderByCreatedAtDesc();
    }
}
