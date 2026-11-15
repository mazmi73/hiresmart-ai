package com.hiresmart.repository;

import com.hiresmart.entity.JobOffer;
import com.hiresmart.entity.JobStatus;
import com.hiresmart.entity.EmploymentType;
import com.hiresmart.entity.ExperienceLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long>, JpaSpecificationExecutor<JobOffer> {

    List<JobOffer> findByStatusOrderByCreatedAtDesc(JobStatus status);

    Page<JobOffer> findByStatusOrderByCreatedAtDesc(JobStatus status, Pageable pageable);

    List<JobOffer> findByRecruiterIdOrderByCreatedAtDesc(Long recruiterId);

    long countByRecruiterId(Long recruiterId);

    long countByRecruiterIdAndStatus(Long recruiterId, JobStatus status);

    long countByStatus(JobStatus status);

    List<JobOffer> findAllByOrderByCreatedAtDesc();

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT j.requiredSkills FROM JobOffer j WHERE j.requiredSkills IS NOT NULL")
    List<String> findAllRequiredSkillsStrings();
}
