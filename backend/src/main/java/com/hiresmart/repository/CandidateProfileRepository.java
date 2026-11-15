package com.hiresmart.repository;

import com.hiresmart.entity.CandidateProfile;
import com.hiresmart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
    Optional<CandidateProfile> findByUser(User user);
    Optional<CandidateProfile> findByUserId(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT c.skills FROM CandidateProfile c WHERE c.skills IS NOT NULL")
    java.util.List<String> findAllCandidateSkillsStrings();
}
