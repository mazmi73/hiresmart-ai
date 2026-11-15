package com.hiresmart.service;

import com.hiresmart.entity.Skill;
import com.hiresmart.repository.SkillRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

@Service
public class SkillService {

    private static final Logger logger = LoggerFactory.getLogger(SkillService.class);

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    /**
     * Parses comma- or semicolon-separated skills string and permanently
     * persists any new skills into the database.
     * Skills remain in the database forever even if all job offers referencing them are deleted.
     */
    @Transactional
    public void saveSkillsFromText(String rawSkills) {
        if (rawSkills == null || rawSkills.isBlank()) {
            return;
        }

        String[] tokens = rawSkills.split("[,;]+");
        for (String token : tokens) {
            saveSingleSkill(token);
        }
    }

    /**
     * Permanently saves a collection of skill names if not already present.
     */
    @Transactional
    public void saveSkills(Collection<String> skills) {
        if (skills == null || skills.isEmpty()) {
            return;
        }
        for (String s : skills) {
            saveSingleSkill(s);
        }
    }

    /**
     * Safely saves a single skill into the permanent skills registry.
     */
    @Transactional
    public void saveSingleSkill(String skillName) {
        if (skillName == null) return;
        String name = skillName.trim();
        if (name.isEmpty()) return;

        String normalized = name.toLowerCase();
        if (!skillRepository.existsByNormalizedName(normalized)) {
            try {
                String category = classifyCategory(name);
                Skill skill = new Skill(name, normalized, category);
                skillRepository.save(skill);
                logger.info("Permanently registered new skill in database: '{}' [{}]", name, category);
            } catch (Exception e) {
                // Ignore concurrent unique constraint conflicts
                logger.debug("Skill '{}' already exists or concurrent insert conflict: {}", name, e.getMessage());
            }
        }
    }

    /**
     * Intelligently assigns the appropriate industry domain category for a skill.
     */
    public String classifyCategory(String skillName) {
        if (skillName == null) return "General";
        String norm = skillName.trim().toLowerCase();

        if (norm.matches(".*(android|ios|swift|kotlin|flutter|react native|dart|compose|xcode|mobile|coroutines).*")) {
            return "Mobile Development";
        }
        if (norm.matches(".*(aws|azure|gcp|docker|kubernetes|terraform|ansible|helm|ci/cd|gitlab|prometheus|grafana|linux|redhat|bash|powershell|cloud|devops|virtualization|vmware|serverless|system admin|microservice|maven).*")) {
            return "Cloud, DevOps & Systems";
        }
        if (norm.matches(".*(sql|database|postgres|mongo|redis|oracle|big data|hadoop|spark|kafka|airflow|etl|warehouse|tensor|pytorch|scikit|nlp|ai |ml |mlops|pandas|analytics|data).*")) {
            return "Data & AI / Machine Learning";
        }
        if (norm.matches(".*(cyber|security|siem|splunk|soc|threat|malware|ddos|firewall|wireshark|crypto|pki|network|cisco|bgp|5g|fiber|oauth|iso 27001|pci).*")) {
            return "Cybersecurity & Networking";
        }
        if (norm.matches(".*(finance|accounting|audit|tax|banking|bancassurance|credit|lending|solvency|basel|actuarial|valuation|m&a|risk|insurance|claims).*")) {
            return "Business, Finance & Banking";
        }
        if (norm.matches(".*(sales|selling|marketing|crm|salesforce|b2b|b2c|cold calling|lead gen|retail|merchandis|luxury|clienteling|brand|pricing).*")) {
            return "Sales, Marketing & Retail";
        }
        if (norm.matches(".*(supply chain|logistics|warehouse|inventory|lean|kaizen|5s|8d|apqp|fmea|automotive|embedded|microcontroller|rtos|autocad|robotics|iot|mqtt|manufacturing).*")) {
            return "Supply Chain & Engineering";
        }
        if (norm.matches(".*(project management|agile|scrum|kanban|jira|confluence|pmo|leadership|management|consulting|hr|talent|recruit|interview|training|communication|customer service|helpdesk|itil|itsm|servicenow|legal|contract|negotiat).*")) {
            return "Management, HR & Operations";
        }
        if (norm.matches(".*(java|python|c#|c\\+\\+|php|\\.net|spring|django|fastapi|node|react|angular|vue|typescript|javascript|html|css|tailwind|redux|rxjs|rest|api|graphql|testing|test|qa|junit|jest).*")) {
            return "Software & Web Development";
        }
        return "General";
    }

    /**
     * Retrieves all permanent skills from the database, optionally filtered by keyword.
     */
    public List<String> getSkills(String query) {
        if (query != null && !query.isBlank()) {
            return skillRepository.searchSkillNames(query.trim());
        }
        return skillRepository.findAllSkillNames();
    }
}
