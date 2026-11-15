package com.hiresmart.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
public class OllamaService {

    private static final Logger logger = LoggerFactory.getLogger(OllamaService.class);

    @Value("${hiresmart.ollama.api-url:http://host.docker.internal:11434/v1/chat/completions}")
    private String apiUrl;

    @Value("${hiresmart.ollama.base-url:http://host.docker.internal:11434}")
    private String baseUrl;

    @Value("${hiresmart.ollama.model:llama3.2:3b}")
    private String configuredModel;

    private static final List<String> CANDIDATE_MODELS = List.of(
            "llama3.2:3b",
            "llama3.2:latest",
            "llama3.2:1b",
            "llama3:latest",
            "qwen2.5:1.5b",
            "qwen2.5:7b"
    );

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private volatile String lastErrorMessage = null;

    public OllamaService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        // Generous read timeout for local CPU inference
        factory.setReadTimeout(120000);
        this.restTemplate = new RestTemplate(factory);
    }

    public String getLastErrorMessage() {
        return lastErrorMessage;
    }

    public boolean isAvailable() {
        try {
            // Quick check against Ollama ping endpoint
            String pingUrl = baseUrl != null ? baseUrl : "http://host.docker.internal:11434";
            ResponseEntity<String> resp = restTemplate.getForEntity(pingUrl, String.class);
            return resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null && resp.getBody().contains("Ollama is running");
        } catch (Exception e) {
            // Also test localhost fallback in case app runs outside docker
            try {
                ResponseEntity<String> resp = restTemplate.getForEntity("http://localhost:11434", String.class);
                return resp.getStatusCode().is2xxSuccessful();
            } catch (Exception ex) {
                logger.debug("Ollama not reachable: {}", e.getMessage());
                return false;
            }
        }
    }

    /**
     * Enhanced CV analysis using local Ollama on-device LLM (Meta Llama 3.2 3B).
     */
    public Optional<OllamaAnalysisResult> analyzeCv(String requiredSkills, String cvText) {
        this.lastErrorMessage = null;

        try {
            String userContent = String.format("""
                Required Skills: %s
                
                Candidate CV Text:
                \"\"\"
                %s
                \"\"\"
                
                Analyze the candidate CV against the required skills. Output strictly a JSON object with:
                - "explanation": a concise 2-sentence professional assessment of candidate's qualifications, highlighting verified matches and noticeable gaps.
                - "additionalExtractedSkills": array of string skill names detected in the CV.
                """, requiredSkills, cvText != null && cvText.length() > 2000 ? cvText.substring(0, 2000) : cvText);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            List<String> modelsToTry = new ArrayList<>();
            if (configuredModel != null && !configuredModel.isBlank()) {
                modelsToTry.add(configuredModel.trim());
            }
            for (String m : CANDIDATE_MODELS) {
                if (!modelsToTry.contains(m)) {
                    modelsToTry.add(m);
                }
            }

            for (String modelName : modelsToTry) {
                try {
                    Map<String, Object> requestBody = Map.of(
                            "model", modelName,
                            "temperature", 0.1,
                            "max_tokens", 300,
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
                                logger.info("Successfully received CV analysis from local Ollama using model: {}", modelName);
                                return Optional.of(new OllamaAnalysisResult(explanation, extraSkills, modelName));
                            }
                        }
                    }
                } catch (HttpStatusCodeException httpEx) {
                    this.lastErrorMessage = "Ollama returned HTTP " + httpEx.getStatusCode().value() + " for model " + modelName;
                    logger.warn("Ollama model {} failed (HTTP {}). Trying next...", modelName, httpEx.getStatusCode().value());
                } catch (Exception ex) {
                    this.lastErrorMessage = "Ollama model " + modelName + " attempt failed: " + ex.getMessage();
                    logger.warn("Ollama model {} attempt failed ({}). Trying next...", modelName, ex.getMessage());
                }
            }
        } catch (Exception e) {
            logger.warn("Ollama request preparation failed: {}", e.getMessage());
            this.lastErrorMessage = e.getMessage();
        }

        return Optional.empty();
    }

    public static class OllamaAnalysisResult {
        private final String explanation;
        private final List<String> additionalSkills;
        private final String modelName;

        public OllamaAnalysisResult(String explanation, List<String> additionalSkills, String modelName) {
            this.explanation = explanation;
            this.additionalSkills = additionalSkills != null ? additionalSkills : Collections.emptyList();
            this.modelName = modelName;
        }

        public String getExplanation() {
            return explanation;
        }

        public List<String> getAdditionalSkills() {
            return additionalSkills;
        }

        public String getModelName() {
            return modelName;
        }
    }
}
