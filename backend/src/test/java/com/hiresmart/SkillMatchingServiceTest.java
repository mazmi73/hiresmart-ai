package com.hiresmart;

import com.hiresmart.service.SkillMatchingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class SkillMatchingServiceTest {

    private SkillMatchingService skillMatchingService;

    @BeforeEach
    void setUp() {
        skillMatchingService = new SkillMatchingService();
    }

    @Test
    @DisplayName("Should accurately calculate 60% skill overlap for standard PFE test scenario")
    void testExactSixtyPercentMatchingScenario() {
        // Given: Required skills: Java, Spring Boot, Angular, Docker, PostgreSQL (total 5)
        String requiredSkills = "Java, Spring Boot, Angular, Docker, PostgreSQL";

        // Candidate CV text contains: Java, Spring Boot, Angular, Git (3 matches out of 5 required)
        String candidateCvText = """
                ALEX VANCE - SOFTWARE ENGINEER
                SUMMARY:
                Dynamic engineer with extensive hands-on experience in Java, Spring Boot enterprise services,
                and modern Angular single-page applications. Proficient with Git version control and team workflows.
                """;

        // When:
        SkillMatchingService.MatchResult result = skillMatchingService.matchSkills(requiredSkills, candidateCvText);

        // Then:
        assertEquals(60.0, result.getPercentage(), 0.01, "Skill match percentage must be exactly 60.0%");
        assertTrue(result.getMatchedSkills().contains("Java"), "Must match Java");
        assertTrue(result.getMatchedSkills().contains("Spring Boot"), "Must match Spring Boot");
        assertTrue(result.getMatchedSkills().contains("Angular"), "Must match Angular");
        assertEquals(3, result.getMatchedSkills().size(), "Must match exactly 3 required skills");

        assertTrue(result.getMissingSkills().contains("Docker"), "Docker must be identified as missing");
        assertTrue(result.getMissingSkills().contains("PostgreSQL"), "PostgreSQL must be identified as missing");
        assertEquals(2, result.getMissingSkills().size(), "Must identify exactly 2 missing skills");

        assertTrue(result.getExplanation().contains("60.0%"), "Explanation must state 60.0%");
        assertTrue(result.getExplanation().contains("3 of 5"), "Explanation must state 3 of 5");
    }

    @Test
    @DisplayName("Should handle 100% full skill match")
    void testFullSkillMatch() {
        String requiredSkills = "Java, Spring Boot, Docker";
        String candidateCvText = "Expert in Java, Spring Boot, Docker, and Kubernetes.";

        SkillMatchingService.MatchResult result = skillMatchingService.matchSkills(requiredSkills, candidateCvText);

        assertEquals(100.0, result.getPercentage(), 0.01);
        assertEquals(3, result.getMatchedSkills().size());
        assertTrue(result.getMissingSkills().isEmpty());
    }

    @Test
    @DisplayName("Should handle zero required skills gracefully without division by zero")
    void testZeroRequiredSkillsNoDivisionByZero() {
        String requiredSkills = "";
        String candidateCvText = "Proficient in Java and Angular.";

        SkillMatchingService.MatchResult result = skillMatchingService.matchSkills(requiredSkills, candidateCvText);

        assertEquals(0.0, result.getPercentage());
        assertFalse(result.isValid());
        assertTrue(result.getExplanation().contains("Analysis unavailable"));
    }

    @Test
    @DisplayName("Should normalize aliases correctly (e.g. Postgres -> PostgreSQL, springboot -> Spring Boot)")
    void testAliasNormalization() {
        String requiredSkills = "PostgreSQL, Spring Boot, TypeScript";
        String candidateCvText = "Experienced with postgres database, springboot frameworks, and TS frontend logic.";

        SkillMatchingService.MatchResult result = skillMatchingService.matchSkills(requiredSkills, candidateCvText);

        assertEquals(100.0, result.getPercentage(), 0.01);
        assertEquals(3, result.getMatchedSkills().size());
    }
}
