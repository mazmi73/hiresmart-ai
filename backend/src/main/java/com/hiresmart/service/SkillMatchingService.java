package com.hiresmart.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class SkillMatchingService {

    private static final Logger logger = LoggerFactory.getLogger(SkillMatchingService.class);

    // Dictionary of Canonical Skill Name -> List of Regex/Alias Patterns
    private final Map<String, List<String>> skillDictionary = new LinkedHashMap<>();

    public SkillMatchingService() {
        initSkillDictionary();
    }

    private void initSkillDictionary() {
        skillDictionary.put("Java", List.of("(?i)\\bjava\\b(?!script)"));
        skillDictionary.put("Spring Boot", List.of("(?i)\\b(spring\\s*boot|springboot|spring\\s*framework|spring)\\b"));
        skillDictionary.put("Angular", List.of("(?i)\\b(angular|angularjs|angular\\s*2\\+|angular\\s*[0-9]+)\\b"));
        skillDictionary.put("React", List.of("(?i)\\b(react|react\\.js|reactjs)\\b"));
        skillDictionary.put("TypeScript", List.of("(?i)\\b(typescript|ts)\\b"));
        skillDictionary.put("JavaScript", List.of("(?i)\\b(javascript|js|es6|ecmascript)\\b"));
        skillDictionary.put("PostgreSQL", List.of("(?i)\\b(postgresql|postgres|psql)\\b"));
        skillDictionary.put("Docker", List.of("(?i)\\b(docker|docker\\s*compose|containers|containerization)\\b"));
        skillDictionary.put("Git", List.of("(?i)\\b(git|github|gitlab|bitbucket)\\b"));
        skillDictionary.put("REST APIs", List.of("(?i)\\b(rest\\s*apis?|restful(\\s*apis?)?|web\\s*apis?|rest\\s*services?)\\b"));
        skillDictionary.put("SQL", List.of("(?i)\\b(sql|rdbms|relational\\s*databases?)\\b"));
        skillDictionary.put("Python", List.of("(?i)\\b(python|python3|django|fastapi|flask)\\b"));
        skillDictionary.put("AWS", List.of("(?i)\\b(aws|amazon\\s*web\\s*services|ec2|s3|lambda)\\b"));
        skillDictionary.put("Azure", List.of("(?i)\\b(azure|microsoft\\s*azure)\\b"));
        skillDictionary.put("GCP", List.of("(?i)\\b(gcp|google\\s*cloud|google\\s*cloud\\s*platform)\\b"));
        skillDictionary.put("Kubernetes", List.of("(?i)\\b(kubernetes|k8s)\\b"));
        skillDictionary.put("Tailwind CSS", List.of("(?i)\\b(tailwind|tailwindcss|tailwind\\s*css)\\b"));
        skillDictionary.put("Linux", List.of("(?i)\\b(linux|ubuntu|debian|centos|bash|shell)\\b"));
        skillDictionary.put("CI/CD", List.of("(?i)\\b(ci/cd|cicd|jenkins|github\\s*actions|gitlab\\s*ci)\\b"));
        skillDictionary.put("Maven", List.of("(?i)\\b(maven|mvn)\\b"));
        skillDictionary.put("Hibernate", List.of("(?i)\\b(hibernate|jpa|spring\\s*data\\s*jpa)\\b"));
        skillDictionary.put("Node.js", List.of("(?i)\\b(node|nodejs|node\\.js)\\b"));
        skillDictionary.put("HTML/CSS", List.of("(?i)\\b(html|html5|css|css3)\\b"));
        skillDictionary.put("GraphQL", List.of("(?i)\\b(graphql)\\b"));
        skillDictionary.put("MongoDB", List.of("(?i)\\b(mongodb|mongo)\\b"));
        skillDictionary.put("Redis", List.of("(?i)\\b(redis)\\b"));
        skillDictionary.put("C#", List.of("(?i)\\b(c#|csharp|\\.net|dotnet)\\b"));
        skillDictionary.put("C++", List.of("(?i)\\b(c\\+\\+|cpp)\\b"));
        skillDictionary.put("Agile/Scrum", List.of("(?i)\\b(agile|scrum|kanban|jira)\\b"));
        skillDictionary.put("Unit Testing", List.of("(?i)\\b(junit|mockito|jest|unit\\s*testing|tdd)\\b"));

        // Diverse Moroccan Business & Industry Domains
        skillDictionary.put("B2B Sales", List.of("(?i)\\b(b2b\\s*sales|b2b|corporate\\s*sales|business-to-business)\\b"));
        skillDictionary.put("Business Development", List.of("(?i)\\b(business\\s*development|bizdev|client\\s*acquisition)\\b"));
        skillDictionary.put("Project Management", List.of("(?i)\\b(project\\s*management|pmp|prince2|project\\s*manager)\\b"));
        skillDictionary.put("Financial Analysis", List.of("(?i)\\b(financial\\s*analysis|financial\\s*modeling|valuation|corporate\\s*finance)\\b"));
        skillDictionary.put("Customer Service", List.of("(?i)\\b(customer\\s*service|customer\\s*support|client\\s*support|csat)\\b"));
        skillDictionary.put("CRM", List.of("(?i)\\b(crm|salesforce|hubspot|zoho)\\b"));
        skillDictionary.put("English Fluency", List.of("(?i)\\b(english\\s*fluency|fluent\\s*in\\s*english|bilingual\\s*english|english\\s*specialist)\\b"));
        skillDictionary.put("Negotiation", List.of("(?i)\\b(negotiation|contract\\s*negotiation|commercial\\s*negotiation)\\b"));
        skillDictionary.put("Team Leadership", List.of("(?i)\\b(team\\s*leadership|leadership|people\\s*management|supervision)\\b"));
        skillDictionary.put("Supply Chain", List.of("(?i)\\b(supply\\s*chain|logistics|procurement|inventory\\s*management)\\b"));
        skillDictionary.put("Digital Marketing", List.of("(?i)\\b(digital\\s*marketing|seo|social\\s*media|growth\\s*marketing)\\b"));
        skillDictionary.put("Data Analysis", List.of("(?i)\\b(data\\s*analysis|data\\s*analytics|power\\s*bi|tableau|excel)\\b"));
        skillDictionary.put("Risk Management", List.of("(?i)\\b(risk\\s*management|credit\\s*risk|operational\\s*risk)\\b"));
        skillDictionary.put("Lean Manufacturing", List.of("(?i)\\b(lean\\s*manufacturing|lean|5s|kaizen|continuous\\s*improvement)\\b"));
        skillDictionary.put("Quality Assurance", List.of("(?i)\\b(quality\\s*assurance|qa|quality\\s*control|iso\\s*9001|iso\\s*16949)\\b"));
        skillDictionary.put("Actuarial Science", List.of("(?i)\\b(actuarial|actuarial\\s*science|solvency\\s*ii)\\b"));
        skillDictionary.put("Insurance Underwriting", List.of("(?i)\\b(underwriting|insurance\\s*underwriting|risk\\s*assessment)\\b"));
    }

    public Set<String> getCanonicalSkills() {
        return Collections.unmodifiableSet(skillDictionary.keySet());
    }

    /**
     * Extracts known skills detected inside text content.
     */
    public List<String> extractSkillsFromText(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptyList();
        }

        Set<String> detected = new LinkedHashSet<>();
        for (Map.Entry<String, List<String>> entry : skillDictionary.entrySet()) {
            String skill = entry.getKey();
            for (String regex : entry.getValue()) {
                if (Pattern.compile(regex).matcher(text).find()) {
                    detected.add(skill);
                    break;
                }
            }
        }
        return new ArrayList<>(detected);
    }

    /**
     * Parses required skills list from job offer (comma or semicolon separated).
     */
    public List<String> parseRequiredSkills(String rawRequiredSkills) {
        if (rawRequiredSkills == null || rawRequiredSkills.isBlank()) {
            return Collections.emptyList();
        }

        String[] parts = rawRequiredSkills.split("[,;]+");
        List<String> list = new ArrayList<>();
        for (String part : parts) {
            String trimmed = part.trim();
            if (!trimmed.isEmpty()) {
                // Map to canonical name if recognized in dictionary
                String canonical = findCanonicalName(trimmed);
                list.add(canonical);
            }
        }
        return list;
    }

    /**
     * Resolves a skill string to its canonical dictionary name if an alias matches.
     */
    public String findCanonicalName(String skillName) {
        String clean = skillName.trim();
        for (Map.Entry<String, List<String>> entry : skillDictionary.entrySet()) {
            if (entry.getKey().equalsIgnoreCase(clean)) {
                return entry.getKey();
            }
            for (String regex : entry.getValue()) {
                if (Pattern.compile(regex).matcher(clean).find()) {
                    return entry.getKey();
                }
            }
        }
        return clean;
    }

    /**
     * Performs skill matching between required job skills and CV text.
     */
    public MatchResult matchSkills(String rawRequiredSkills, String cvText) {
        List<String> requiredSkills = parseRequiredSkills(rawRequiredSkills);
        List<String> extractedSkills = extractSkillsFromText(cvText);

        if (requiredSkills.isEmpty()) {
            return new MatchResult(
                    0.0,
                    Collections.emptyList(),
                    Collections.emptyList(),
                    extractedSkills,
                    "Analysis unavailable: This job offer has no required skills configured.",
                    false
            );
        }

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String req : requiredSkills) {
            boolean found = false;
            // 1. Check if canonical name is in extracted skills
            for (String ext : extractedSkills) {
                if (ext.equalsIgnoreCase(req)) {
                    found = true;
                    break;
                }
            }
            // 2. Fallback: check if the exact word or alias pattern appears in cvText
            if (!found && cvText != null) {
                List<String> patterns = skillDictionary.get(req);
                if (patterns != null) {
                    for (String pattern : patterns) {
                        if (Pattern.compile(pattern).matcher(cvText).find()) {
                            found = true;
                            break;
                        }
                    }
                } else {
                    // Custom required skill not in dictionary: word boundary match
                    String escaped = Pattern.quote(req);
                    if (Pattern.compile("(?i)\\b" + escaped + "\\b").matcher(cvText).find()) {
                        found = true;
                    }
                }
            }

            if (found) {
                matchedSkills.add(req);
            } else {
                missingSkills.add(req);
            }
        }

        double percentage = (matchedSkills.size() * 100.0) / requiredSkills.size();
        percentage = Math.round(percentage * 10.0) / 10.0;

        String explanation = buildExplanation(percentage, matchedSkills, missingSkills, requiredSkills.size());

        return new MatchResult(
                percentage,
                matchedSkills,
                missingSkills,
                extractedSkills,
                explanation,
                true
        );
    }

    private String buildExplanation(double percentage, List<String> matched, List<String> missing, int totalRequired) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Candidate CV documents %d of %d required skills (%.1f%% overlap).\n\n",
                matched.size(), totalRequired, percentage));

        if (!matched.isEmpty()) {
            sb.append("• Matched Competencies: ").append(String.join(", ", matched)).append("\n");
        } else {
            sb.append("• Matched Competencies: None detected\n");
        }

        if (!missing.isEmpty()) {
            sb.append("• Required Skills Not Detected: ").append(String.join(", ", missing)).append("\n\n");
        } else {
            sb.append("• Required Skills Not Detected: All required skills are documented in CV!\n\n");
        }

        sb.append("Notice: This automated assessment calculates documented keyword overlap from the uploaded PDF CV. ")
          .append("It is intended for recruiter guidance and screening assistance only. ")
          .append("It does not evaluate overall candidate suitability, soft skills, or unwritten professional experience.");

        return sb.toString();
    }

    public static class MatchResult {
        private final double percentage;
        private final List<String> matchedSkills;
        private final List<String> missingSkills;
        private final List<String> extractedSkills;
        private final String explanation;
        private final boolean valid;

        public MatchResult(double percentage,
                           List<String> matchedSkills,
                           List<String> missingSkills,
                           List<String> extractedSkills,
                           String explanation,
                           boolean valid) {
            this.percentage = percentage;
            this.matchedSkills = matchedSkills;
            this.missingSkills = missingSkills;
            this.extractedSkills = extractedSkills;
            this.explanation = explanation;
            this.valid = valid;
        }

        public double getPercentage() {
            return percentage;
        }

        public List<String> getMatchedSkills() {
            return matchedSkills;
        }

        public List<String> getMissingSkills() {
            return missingSkills;
        }

        public List<String> getExtractedSkills() {
            return extractedSkills;
        }

        public String getExplanation() {
            return explanation;
        }

        public boolean isValid() {
            return valid;
        }
    }
}
