package com.hiresmart.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiresmart.entity.SystemConfig;
import com.hiresmart.repository.SystemConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GroqService {

    private static final Logger logger = LoggerFactory.getLogger(GroqService.class);

    @Value("${hiresmart.groq.api-key:}")
    private String apiKey;

    @Value("${hiresmart.groq.api-url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    private static final List<String> FALLBACK_MODELS = List.of(
            "openai/gpt-oss-120b",
            "openai/gpt-oss-20b",
            "qwen/qwen3.8-27b",
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "mixtral-8x7b-32768"
    );

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SystemConfigRepository systemConfigRepository;

    private volatile String lastErrorMessage = null;

    public GroqService(SystemConfigRepository systemConfigRepository) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(6000);
        factory.setReadTimeout(15000);
        this.restTemplate = new RestTemplate(factory);
        this.systemConfigRepository = systemConfigRepository;
    }

    public String getLastErrorMessage() {
        return lastErrorMessage;
    }

    public String getEffectiveApiKey() {
        String key = "";
        if (systemConfigRepository != null) {
            Optional<SystemConfig> configOpt = systemConfigRepository.findByConfigKey("GROQ_API_KEY");
            if (configOpt.isPresent()) {
                String val = configOpt.get().getConfigValue();
                if (val != null && !val.trim().isEmpty() && !val.trim().equalsIgnoreCase("optional_groq_api_key_here")) {
                    key = val.trim();
                }
            }
        }
        if (key.isEmpty() && apiKey != null) {
            key = apiKey.trim();
        }
        return key;
    }

    public boolean isConfigured() {
        String key = getEffectiveApiKey();
        return !key.isEmpty() && !key.equalsIgnoreCase("optional_groq_api_key_here");
    }

    /**
     * Enhanced CV analysis using GroqCloud LPU inference (Meta Llama 3.3 70B / Llama 3.1 8B).
     */
    public Optional<GroqAnalysisResult> analyzeCv(String requiredSkills, String cvText) {
        this.lastErrorMessage = null;
        if (!isConfigured()) {
            this.lastErrorMessage = "Groq API key is not configured in Admin > System Configuration";
            logger.debug("Groq API key is not configured; fallback to local skill engine.");
            return Optional.empty();
        }

        try {
            String activeKey = getEffectiveApiKey();

            String userContent = String.format("""
                Required Skills: %s
                
                Candidate CV Text:
                \"\"\"
                %s
                \"\"\"
                
                Analyze the candidate CV against the required skills. Output strictly a JSON object with:
                - "explanation": a concise 2-3 sentence professional assessment of candidate's qualifications, highlighting verified matches and noticeable gaps.
                - "additionalExtractedSkills": array of string skill names detected in the CV.
                """, requiredSkills, cvText != null && cvText.length() > 3000 ? cvText.substring(0, 3000) : cvText);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(activeKey);

            for (String modelName : FALLBACK_MODELS) {
                try {
                    Map<String, Object> requestBody = Map.of(
                            "model", modelName,
                            "temperature", 0.2,
                            "response_format", Map.of("type", "json_object"),
                            "messages", List.of(
                                    Map.of("role", "system", "content", "You are an expert AI recruitment analysis assistant. Reply strictly with valid JSON with keys 'explanation' (string) and 'additionalExtractedSkills' (array of strings)."),
                                    Map.of("role", "user", "content", userContent)
                            )
                    );

                    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
                    ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

                    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                        JsonNode root = objectMapper.readTree(response.getBody());
                        JsonNode choices = root.path("choices");
                        if (choices.isArray() && !choices.isEmpty()) {
                            String content = choices.get(0).path("message").path("content").asText("");
                            if (content.contains("{") && content.contains("}")) {
                                int sIdx = content.indexOf("{");
                                int eIdx = content.lastIndexOf("}") + 1;
                                content = content.substring(sIdx, eIdx);
                            }
                            JsonNode parsed = objectMapper.readTree(content);

                            String explanation = parsed.path("explanation").asText("");
                            List<String> extraSkills = new ArrayList<>();
                            JsonNode extraNode = parsed.path("additionalExtractedSkills");
                            if (extraNode.isArray()) {
                                for (JsonNode item : extraNode) {
                                    extraSkills.add(item.asText());
                                }
                            }

                            if (!explanation.isBlank()) {
                                logger.info("Successfully received CV analysis from Groq using model: {}", modelName);
                                return Optional.of(new GroqAnalysisResult(explanation, extraSkills, modelName));
                            }
                        }
                    }
                } catch (HttpStatusCodeException httpEx) {
                    String resp = httpEx.getResponseBodyAsString();
                    if (resp != null && (resp.contains("rate_limit_exceeded") || httpEx.getStatusCode().value() == 429)) {
                        this.lastErrorMessage = "Groq rate limit exceeded (30 requests/min). Please try again in a few moments";
                        logger.warn("Groq rate limit: {}", resp);
                    } else if (resp != null && (resp.contains("invalid_api_key") || httpEx.getStatusCode().value() == 401)) {
                        this.lastErrorMessage = "Groq API key is invalid. Please verify your free key at https://console.groq.com/keys";
                        logger.warn("Groq key invalid: {}", resp);
                        break;
                    } else {
                        this.lastErrorMessage = "Groq API returned HTTP " + httpEx.getStatusCode().value();
                        logger.warn("Groq model {} failed (HTTP {}). Trying next model...", modelName, httpEx.getStatusCode().value());
                    }
                } catch (Exception ex) {
                    logger.warn("Groq model {} attempt failed ({}). Trying next model...", modelName, ex.getMessage());
                }
            }
        } catch (Exception e) {
            logger.warn("Groq request preparation failed: {}", e.getMessage());
            this.lastErrorMessage = e.getMessage();
        }

        return Optional.empty();
    }

    public static class GroqAnalysisResult {
        private final String explanation;
        private final List<String> additionalSkills;
        private final String modelName;

        public GroqAnalysisResult(String explanation, List<String> additionalSkills, String modelName) {
            this.explanation = explanation;
            this.additionalSkills = additionalSkills;
            this.modelName = modelName;
        }

        public String getExplanation() {
            return explanation;
        }

        public List<String> getAdditionalSkills() {
            return additionalSkills;
        }

        public String getModelName() {
            return modelName != null ? modelName : "Meta Llama 3.3 (Groq)";
        }
    }
}
