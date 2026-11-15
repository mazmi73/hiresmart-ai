package com.hiresmart.repository;

import com.hiresmart.entity.Application;
import com.hiresmart.entity.CVAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CVAnalysisRepository extends JpaRepository<CVAnalysis, Long> {
    Optional<CVAnalysis> findByApplicationId(Long applicationId);
    Optional<CVAnalysis> findByApplication(Application application);
}
