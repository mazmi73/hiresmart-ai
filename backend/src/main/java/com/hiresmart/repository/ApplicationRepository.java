package com.hiresmart.repository;

import com.hiresmart.entity.Application;
import com.hiresmart.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByCandidateIdOrderByCreatedAtDesc(Long candidateId);

    List<Application> findByJobOfferIdOrderByCreatedAtDesc(Long jobOfferId);

    List<Application> findByJobOfferRecruiterIdOrderByCreatedAtDesc(Long recruiterId);

    boolean existsByJobOfferIdAndCandidateId(Long jobOfferId, Long candidateId);

    Optional<Application> findByJobOfferIdAndCandidateId(Long jobOfferId, Long candidateId);

    long countByJobOfferRecruiterId(Long recruiterId);

    long countByJobOfferRecruiterIdAndStatus(Long recruiterId, ApplicationStatus status);

    List<Application> findTop5ByJobOfferRecruiterIdOrderByCreatedAtDesc(Long recruiterId);
}
