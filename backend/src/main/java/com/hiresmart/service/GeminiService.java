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
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${hiresmart.gemini.api-key:}")
    private String apiKey;

    @Value("${hiresmart.gemini.api-url:https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent}")
    private String apiUrl;

    private static final List<String> FALLBACK_MODELS = List.of(
            "gemini-3.1-flash-lite",
            "gemini-3.5-flash-lite",
            "gemini-flash-latest",
            "gemini-3.5-flash"
    );

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SystemConfigRepository systemConfigRepository;

    private volatile String lastErrorMessage = null;

    public GeminiService(SystemConfigRepository systemConfigRepository) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(12000);
        this.restTemplate = new RestTemplate(factory);
        this.systemConfigRepository = systemConfigRepository;
    }

    public String getEffectiveApiKey() {
        if (systemConfigRepository != null) {
            Optional<SystemConfig> configOpt = systemConfigRepository.findByConfigKey("GEMINI_API_KEY");
            if (configOpt.isPresent()) {
                String val = configOpt.get().getConfigValue();
                if (val != null && !val.trim().isEmpty() && !val.trim().equalsIgnoreCase("optional_gemini_api_key_here")) {
                    return val.trim();
                }
            }
        }
        return (apiKey != null) ? apiKey.trim() : "";
    }

    public boolean isConfigured() {
        String key = getEffectiveApiKey();
        return !key.isEmpty() && !key.equalsIgnoreCase("optional_gemini_api_key_here");
    }

    public String getLastErrorMessage() {
        return lastErrorMessage;
    }

    /**
     * Enhanced CV analysis using Gemini API.
     * Returns Optional.empty() if unconfigured or on any failure so local fallback is used.
     */
    public Optional<GeminiAnalysisResult> analyzeCv(String requiredSkills, String cvText) {
        this.lastErrorMessage = null;
        if (!isConfigured()) {
            this.lastErrorMessage = "Gemini API key is not configured in Admin > System Configuration";
            logger.debug("Gemini API key is not configured; using deterministic local analysis engine.");
            return Optional.empty();
        }

        try {
            String prompt = String.format("""
                You are an AI recruitment analysis assistant.
                Analyze the following candidate CV text against the job required skills.
                
                Required Skills: %s
                
                Candidate CV Text:
                \"\"\"
                %s
                \"\"\"
                
                Please reply in JSON format with exactly the following structure:
                {
                  "explanation": "A professional 2-3 sentence summary explaining which required skills the candidate documents and which appear missing, plus a note on limitations.",
                  "additionalExtractedSkills": ["Skill1", "Skill2"]
                }
                Do not include markdown ticks around JSON or keep it clean JSON.
                """, requiredSkills, cvText != null && cvText.length() > 3000 ? cvText.substring(0, 3000) : cvText);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)
                            ))
                    ),
                    "generationConfig", Map.of(
                            "temperature", 0.2,
                            "responseMimeType", "application/json"
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String activeKey = getEffectiveApiKey();

            List<String> modelsToTry = new ArrayList<>();
            // Prioritize modern high-efficiency and standard flash models
            modelsToTry.add("gemini-3.1-flash-lite");
            modelsToTry.add("gemini-3.5-flash-lite");
            modelsToTry.add("gemini-flash-latest");
            modelsToTry.add("gemini-3.5-flash");

            for (String modelName : modelsToTry) {
                try {
                    String urlWithKey = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + activeKey;
                    ResponseEntity<String> response = restTemplate.postForEntity(urlWithKey, entity, String.class);

                    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                        JsonNode root = objectMapper.readTree(response.getBody());
                        JsonNode candidates = root.path("candidates");
                        if (candidates.isArray() && !candidates.isEmpty()) {
                            JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                            String responseText = textNode.asText("");
                            if (responseText.contains("{") && responseText.contains("}")) {
                                int sIdx = responseText.indexOf("{");
                                int eIdx = responseText.lastIndexOf("}") + 1;
                                responseText = responseText.substring(sIdx, eIdx);
                            }

                            JsonNode parsed = objectMapper.readTree(responseText);
                            String explanation = parsed.path("explanation").asText("");

                            List<String> extraSkills = new ArrayList<>();
                            JsonNode extraNode = parsed.path("additionalExtractedSkills");
                            if (extraNode.isArray()) {
                                for (JsonNode item : extraNode) {
                                    extraSkills.add(item.asText());
                                }
                            }

                            if (!explanation.isBlank()) {
                                logger.info("Successfully received enhanced analysis from Google Gemini using model: {}", modelName);
                                return Optional.of(new GeminiAnalysisResult(explanation, extraSkills, modelName));
                            }
                        }
                    }
                } catch (org.springframework.web.client.HttpStatusCodeException httpEx) {
                    if (httpEx.getStatusCode().value() == 429) {
                        this.lastErrorMessage = "rate limit reached (15 RPM)";
                    } else if (httpEx.getStatusCode().value() == 503) {
                        this.lastErrorMessage = "model temporarily experiencing high demand (503)";
                    } else {
                        this.lastErrorMessage = "HTTP " + httpEx.getStatusCode().value();
                    }
                    logger.warn("Gemini model {} attempt failed ({}). Trying next supported model...", modelName, httpEx.getMessage());
                } catch (Exception ex) {
                    this.lastErrorMessage = ex.getMessage();
                    logger.warn("Gemini model {} attempt failed ({}). Trying next supported model...", modelName, ex.getMessage());
                }
            }
        } catch (Exception e) {
            this.lastErrorMessage = e.getMessage();
            logger.warn("Gemini request preparation failed (falling back smoothly to local matcher): {}", e.getMessage());
        }

        return Optional.empty();
    }

    public static class GeminiAnalysisResult {
        private final String explanation;
        private final List<String> additionalSkills;
        private final String modelName;

        public GeminiAnalysisResult(String explanation, List<String> additionalSkills, String modelName) {
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
            return modelName != null ? modelName : "Google Gemini";
        }
    }
}
