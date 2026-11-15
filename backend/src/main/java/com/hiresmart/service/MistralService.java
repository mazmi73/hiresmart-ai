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
public class MistralService {

    private static final Logger logger = LoggerFactory.getLogger(MistralService.class);

    @Value("${hiresmart.mistral.api-key:}")
    private String apiKey;

    @Value("${hiresmart.mistral.api-url:https://api.mistral.ai/v1/chat/completions}")
    private String apiUrl;

    private static final List<String> MISTRAL_FALLBACK_MODELS = List.of(
            "mistral-small-latest",
            "open-mistral-7b",
            "codestral-latest",
            "mistral-tiny"
    );

    private static final List<String> OPENROUTER_FALLBACK_MODELS = List.of(
            "openrouter/free",
            "google/gemma-4-31b-it:free",
            "google/gemma-4-26b-a4b-it:free",
            "nvidia/nemotron-3.5-lightning:free",
            "meta-llama/llama-3.3-70b-instruct:free",
            "mistralai/mistral-7b-instruct:free"
    );

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SystemConfigRepository systemConfigRepository;

    private volatile String lastErrorMessage = null;

    public MistralService(SystemConfigRepository systemConfigRepository) {
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
            Optional<SystemConfig> configOpt = systemConfigRepository.findByConfigKey("MISTRAL_API_KEY");
            if (configOpt.isPresent()) {
                String val = configOpt.get().getConfigValue();
                if (val != null && !val.trim().isEmpty() && !val.trim().equalsIgnoreCase("optional_mistral_api_key_here")) {
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
        return !key.isEmpty() && !key.equalsIgnoreCase("optional_mistral_api_key_here");
    }

    /**
     * Enhanced CV analysis using Mistral AI (or OpenRouter free models if sk-or- key provided).
     */
    public Optional<MistralAnalysisResult> analyzeCv(String requiredSkills, String cvText) {
        this.lastErrorMessage = null;
        if (!isConfigured()) {
            this.lastErrorMessage = "Mistral API key is not configured in Admin > System Configuration";
            logger.debug("Mistral API key is not configured; fallback to local skill engine.");
            return Optional.empty();
        }

        try {
            String activeKey = getEffectiveApiKey();
            boolean isOpenRouter = activeKey.startsWith("sk-or-");
            String endpoint = isOpenRouter ? "https://openrouter.ai/api/v1/chat/completions" : apiUrl;
            List<String> models = isOpenRouter ? OPENROUTER_FALLBACK_MODELS : MISTRAL_FALLBACK_MODELS;

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
            if (isOpenRouter) {
                headers.set("HTTP-Referer", "https://hiresmart.ai");
                headers.set("X-Title", "HireSmart AI");
            }

            for (String modelName : models) {
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
                    ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);

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
                                String providerName = isOpenRouter ? "OpenRouter (" + modelName + ")" : "Mistral AI (" + modelName + ")";
                                logger.info("Successfully received CV analysis from {}", providerName);
                                return Optional.of(new MistralAnalysisResult(explanation, extraSkills, providerName));
                            }
                        }
                    }
                } catch (HttpStatusCodeException httpEx) {
                    String resp = httpEx.getResponseBodyAsString();
                    if (resp != null && (resp.contains("rate_limit") || httpEx.getStatusCode().value() == 429)) {
                        this.lastErrorMessage = "Mistral API rate limit reached. Please try again shortly";
                        logger.warn("Mistral rate limit: {}", resp);
                    } else if (resp != null && (resp.contains("Unauthorized") || resp.contains("Invalid API Key") || httpEx.getStatusCode().value() == 401)) {
                        this.lastErrorMessage = "Mistral API key is invalid. Please verify your free key at https://console.mistral.ai/api-keys";
                        logger.warn("Mistral key invalid: {}", resp);
                        break;
                    } else {
                        this.lastErrorMessage = "Mistral API returned HTTP " + httpEx.getStatusCode().value();
                        logger.warn("Mistral model {} failed (HTTP {}). Trying next model...", modelName, httpEx.getStatusCode().value());
                    }
                } catch (Exception ex) {
                    logger.warn("Mistral model {} attempt failed ({}). Trying next model...", modelName, ex.getMessage());
                }
            }
        } catch (Exception e) {
            logger.warn("Mistral request preparation failed: {}", e.getMessage());
            this.lastErrorMessage = e.getMessage();
        }

        return Optional.empty();
    }

    public static class MistralAnalysisResult {
        private final String explanation;
        private final List<String> additionalSkills;
        private final String modelName;

        public MistralAnalysisResult(String explanation, List<String> additionalSkills, String modelName) {
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
            return modelName != null ? modelName : "Mistral AI";
        }
    }
}
