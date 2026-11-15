package com.hiresmart.repository;

import com.hiresmart.entity.CVDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CVDocumentRepository extends JpaRepository<CVDocument, Long> {
    List<CVDocument> findByCandidateIdOrderByCreatedAtDesc(Long candidateId);
    Optional<CVDocument> findTopByCandidateIdOrderByCreatedAtDesc(Long candidateId);
}
