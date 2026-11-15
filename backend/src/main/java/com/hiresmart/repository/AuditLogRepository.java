package com.hiresmart.repository;

import com.hiresmart.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findTop1000ByOrderByCreatedAtDesc();
    List<AuditLog> findByActionOrderByCreatedAtDesc(String action);
    List<AuditLog> findByActorEmailOrderByCreatedAtDesc(String actorEmail);
}
