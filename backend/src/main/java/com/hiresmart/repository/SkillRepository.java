package com.hiresmart.repository;

import com.hiresmart.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findByNormalizedName(String normalizedName);

    boolean existsByNormalizedName(String normalizedName);

    boolean existsByNormalizedNameAndIdNot(String normalizedName, Long id);

    List<Skill> findAllByOrderByCreatedAtDesc();

    List<Skill> findByNameContainingIgnoreCase(String query, org.springframework.data.domain.Sort sort);

    List<Skill> findByCategoryIgnoreCase(String category, org.springframework.data.domain.Sort sort);

    List<Skill> findByNameContainingIgnoreCaseAndCategoryIgnoreCase(String query, String category, org.springframework.data.domain.Sort sort);

    List<Skill> findAllByOrderByNameAsc();

    @Query("SELECT s.name FROM Skill s ORDER BY s.name ASC")
    List<String> findAllSkillNames();

    @Query("SELECT s.name FROM Skill s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY s.name ASC")
    List<String> searchSkillNames(@Param("query") String query);
}
