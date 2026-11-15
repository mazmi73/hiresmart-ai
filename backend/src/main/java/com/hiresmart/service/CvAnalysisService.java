package com.hiresmart.service;

import com.hiresmart.dto.response.CVAnalysisDto;
import com.hiresmart.entity.*;
import com.hiresmart.exception.BadRequestException;
import com.hiresmart.exception.ResourceNotFoundException;
import com.hiresmart.exception.UnauthorizedException;
import com.hiresmart.repository.ApplicationRepository;
import com.hiresmart.repository.CVAnalysisRepository;
import com.hiresmart.repository.SystemConfigRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CvAnalysisService {

    private final ApplicationRepository applicationRepository;
    private final CVAnalysisRepository cvAnalysisRepository;
    private final SkillMatchingService skillMatchingService;
    private final PdfExtractionService pdfExtractionService;
    private final GeminiService geminiService;
    private final GroqService groqService;
    private final MistralService mistralService;
    private final OllamaService ollamaService;
    private final SystemConfigRepository systemConfigRepository;

    public CvAnalysisService(ApplicationRepository applicationRepository,
                             CVAnalysisRepository cvAnalysisRepository,
                             SkillMatchingService skillMatchingService,
                             PdfExtractionService pdfExtractionService,
                             GeminiService geminiService,
                             GroqService groqService,
                             MistralService mistralService,
                             OllamaService ollamaService,
                             SystemConfigRepository systemConfigRepository) {
        this.applicationRepository = applicationRepository;
        this.cvAnalysisRepository = cvAnalysisRepository;
        this.skillMatchingService = skillMatchingService;
        this.pdfExtractionService = pdfExtractionService;
        this.geminiService = geminiService;
        this.groqService = groqService;
        this.mistralService = mistralService;
        this.ollamaService = ollamaService;
        this.systemConfigRepository = systemConfigRepository;
    }

    @Transactional
    public CVAnalysisDto analyzeApplication(Long applicationId, User requester) {
        return analyzeApplication(applicationId, requester, null);
    }

    @Transactional
    public CVAnalysisDto analyzeApplication(Long applicationId, User requester, String requestedEngine) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        // Security check: Only the recruiter of the job or an admin may view/trigger analysis
        boolean isRecruiter = application.getJobOffer().getRecruiter().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == com.hiresmart.entity.Role.ADMIN;
        if (!isRecruiter && !isAdmin) {
            throw new UnauthorizedException("Candidates are not authorized to analyze applications");
        }

        CVDocument cvDocument = application.getCvDocument();
        if (cvDocument == null) {
            throw new BadRequestException("No CV document is attached to this application");
        }

        String cvText = cvDocument.getExtractedText();
        if (cvText == null || cvText.isBlank()) {
            // Attempt to re-extract if file exists on disk
            File file = new File(cvDocument.getFilePath());
            if (file.exists()) {
                cvText = pdfExtractionService.extractTextFromPdf(file);
                cvDocument.setExtractedText(cvText);
            }
        }

        long totalStartTime = System.currentTimeMillis();
        long executionTimeMs = 0L;

        String requiredSkills = application.getJobOffer().getRequiredSkills();
        SkillMatchingService.MatchResult localResult = skillMatchingService.matchSkills(requiredSkills, cvText);

        // Determine engine: prioritize recruiter's explicit selection, then fallback to system config or GEMINI/LOCAL
        String targetEngine = (requestedEngine != null && !requestedEngine.isBlank())
                ? requestedEngine.trim().toUpperCase()
                : systemConfigRepository.findByConfigKey("AI_ENGINE")
                        .map(SystemConfig::getConfigValue)
                        .orElse("GEMINI");

        AiProvider provider = AiProvider.LOCAL;
        String finalExplanation = localResult.getExplanation();
        Set<String> allExtracted = new LinkedHashSet<>(localResult.getExtractedSkills());

        List<String> attemptOrder = buildEngineAttemptOrder(targetEngine);
        List<String> failReasons = new ArrayList<>();
        boolean success = false;

        for (int i = 0; i < attemptOrder.size(); i++) {
            String engine = attemptOrder.get(i);
            boolean isFailover = (i > 0);
            long engineStartTime = System.currentTimeMillis();

            if ("GEMINI".equalsIgnoreCase(engine)) {
                if (!geminiService.isConfigured()) {
                    failReasons.add("Google Gemini: no API key configured");
                    continue;
                }
                Optional<GeminiService.GeminiAnalysisResult> geminiOpt = geminiService.analyzeCv(requiredSkills, cvText);
                if (geminiOpt.isPresent()) {
                    executionTimeMs = System.currentTimeMillis() - engineStartTime;
                    GeminiService.GeminiAnalysisResult gemini = geminiOpt.get();
                    provider = AiProvider.GEMINI;
                    String failoverTag = isFailover
                            ? " — automatic failover from " + getEngineDisplayName(targetEngine)
                            : "";
                    finalExplanation = gemini.getExplanation() + "\n\n" +
                            "[Analysis performed by Google Gemini (" + gemini.getModelName() + ")" + failoverTag + " in " + formatExecutionTime(executionTimeMs) + ". Keyword match score: " + localResult.getPercentage() + "%]";
                    allExtracted.addAll(gemini.getAdditionalSkills());
                    success = true;
                    break;
                } else {
                    String reason = geminiService.getLastErrorMessage();
                    failReasons.add("Google Gemini: " + (reason != null ? reason : "service unavailable"));
                }
            } else if ("GROQ".equalsIgnoreCase(engine) || "LLAMA".equalsIgnoreCase(engine)) {
                if (!groqService.isConfigured()) {
                    failReasons.add("GroqCloud: no API key configured");
                    continue;
                }
                Optional<GroqService.GroqAnalysisResult> groqOpt = groqService.analyzeCv(requiredSkills, cvText);
                if (groqOpt.isPresent()) {
                    executionTimeMs = System.currentTimeMillis() - engineStartTime;
                    GroqService.GroqAnalysisResult groq = groqOpt.get();
                    provider = AiProvider.GROQ;
                    String failoverTag = isFailover
                            ? " — automatic failover from " + getEngineDisplayName(targetEngine)
                            : "";
                    finalExplanation = groq.getExplanation() + "\n\n" +
                            "[Analysis performed by GroqCloud (" + groq.getModelName() + ")" + failoverTag + " in " + formatExecutionTime(executionTimeMs) + ". Keyword match score: " + localResult.getPercentage() + "%]";
                    allExtracted.addAll(groq.getAdditionalSkills());
                    success = true;
                    break;
                } else {
                    String reason = groqService.getLastErrorMessage();
                    failReasons.add("GroqCloud: " + (reason != null ? reason : "service unavailable"));
                }
            } else if ("MISTRAL".equalsIgnoreCase(engine) || "OPENROUTER".equalsIgnoreCase(engine)) {
                if (!mistralService.isConfigured()) {
                    failReasons.add("Mistral / OpenRouter: no API key configured");
                    continue;
                }
                Optional<MistralService.MistralAnalysisResult> mistralOpt = mistralService.analyzeCv(requiredSkills, cvText);
                if (mistralOpt.isPresent()) {
                    executionTimeMs = System.currentTimeMillis() - engineStartTime;
                    MistralService.MistralAnalysisResult mistral = mistralOpt.get();
                    provider = AiProvider.MISTRAL;
                    String failoverTag = isFailover
                            ? " — automatic failover from " + getEngineDisplayName(targetEngine)
                            : "";
                    finalExplanation = mistral.getExplanation() + "\n\n" +
                            "[Analysis performed by " + mistral.getModelName() + failoverTag + " in " + formatExecutionTime(executionTimeMs) + ". Keyword match score: " + localResult.getPercentage() + "%]";
                    allExtracted.addAll(mistral.getAdditionalSkills());
                    success = true;
                    break;
                } else {
                    String reason = mistralService.getLastErrorMessage();
                    failReasons.add("Mistral / OpenRouter: " + (reason != null ? reason : "service unavailable"));
                }
            } else if ("OLLAMA".equalsIgnoreCase(engine)) {
                if (!ollamaService.isAvailable()) {
                    failReasons.add("Ollama (Local LLM): server not reachable at host.docker.internal:11434");
                    continue;
                }
                Optional<OllamaService.OllamaAnalysisResult> ollamaOpt = ollamaService.analyzeCv(requiredSkills, cvText);
                if (ollamaOpt.isPresent()) {
                    executionTimeMs = System.currentTimeMillis() - engineStartTime;
                    OllamaService.OllamaAnalysisResult ollama = ollamaOpt.get();
                    provider = AiProvider.OLLAMA;
                    String failoverTag = isFailover
                            ? " — automatic failover from " + getEngineDisplayName(targetEngine)
                            : "";
                    finalExplanation = ollama.getExplanation() + "\n\n" +
                            "[Analysis performed by Local Ollama (" + ollama.getModelName() + ")" + failoverTag + " in " + formatExecutionTime(executionTimeMs) + ". Keyword match score: " + localResult.getPercentage() + "%]";
                    allExtracted.addAll(ollama.getAdditionalSkills());
                    success = true;
                    break;
                } else {
                    String reason = ollamaService.getLastErrorMessage();
                    failReasons.add("Ollama (Local LLM): " + (reason != null ? reason : "inference failed"));
                }
            }
        }

        if (!success) {
            provider = AiProvider.LOCAL;
            executionTimeMs = System.currentTimeMillis() - totalStartTime;
            if ("LOCAL".equalsIgnoreCase(targetEngine)) {
                finalExplanation = localResult.getExplanation() + "\n\n" +
                        "[Analysis performed by Local Deterministic Skill Engine in " + formatExecutionTime(executionTimeMs) + ". Match score: " + localResult.getPercentage() + "%]";
            } else {
                finalExplanation = localResult.getExplanation() + "\n\n" +
                        "[Notice: Selected AI Engine was " + getEngineDisplayName(targetEngine) + ". All cloud AI fallbacks were attempted (" + String.join("; ", failReasons) + "). Evaluated using Local Deterministic Skill Engine in " + formatExecutionTime(executionTimeMs) + ".]";
            }
        }

        CVAnalysis analysis = cvAnalysisRepository.findByApplication(application)
                .orElse(new CVAnalysis());

        analysis.setApplication(application);
        analysis.setMatchPercentage(localResult.getPercentage());
        analysis.setMatchedSkills(String.join(", ", localResult.getMatchedSkills()));
        analysis.setMissingSkills(String.join(", ", localResult.getMissingSkills()));
        analysis.setExtractedSkills(String.join(", ", allExtracted));
        analysis.setExplanation(finalExplanation);
        analysis.setAiProvider(provider);
        analysis.setExecutionTimeMs(executionTimeMs);

        CVAnalysis saved = cvAnalysisRepository.save(analysis);
        return mapToDto(saved);
    }

    public CVAnalysisDto getAnalysisForApplication(Long applicationId, User requester) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        boolean isRecruiter = application.getJobOffer().getRecruiter().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == com.hiresmart.entity.Role.ADMIN;
        if (!isRecruiter && !isAdmin) {
            throw new UnauthorizedException("Candidates are not authorized to view skills match analysis");
        }

        CVAnalysis analysis = cvAnalysisRepository.findByApplication(application)
                .orElseThrow(() -> new ResourceNotFoundException("No AI CV analysis found for application id: " + applicationId + ". Please trigger an analysis first."));

        return mapToDto(analysis);
    }

    public CVAnalysisDto mapToDto(CVAnalysis analysis) {
        CVAnalysisDto dto = new CVAnalysisDto();
        dto.setId(analysis.getId());
        dto.setApplicationId(analysis.getApplication().getId());
        dto.setMatchPercentage(analysis.getMatchPercentage());
        dto.setMatchedSkills(splitString(analysis.getMatchedSkills()));
        dto.setMissingSkills(splitString(analysis.getMissingSkills()));
        dto.setExtractedSkills(splitString(analysis.getExtractedSkills()));
        dto.setExplanation(analysis.getExplanation());
        dto.setAiProvider(analysis.getAiProvider());
        dto.setExecutionTimeMs(analysis.getExecutionTimeMs());
        dto.setCreatedAt(analysis.getCreatedAt());
        return dto;
    }

    private String formatExecutionTime(long ms) {
        if (ms < 1000) {
            return ms + "ms";
        }
        double seconds = ms / 1000.0;
        return String.format(Locale.US, "%.2fs", seconds);
    }

    private List<String> splitString(String str) {
        if (str == null || str.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(str.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private List<String> buildEngineAttemptOrder(String targetEngine) {
        if ("LOCAL".equalsIgnoreCase(targetEngine)) {
            return Collections.emptyList();
        }
        if ("OLLAMA".equalsIgnoreCase(targetEngine)) {
            return List.of("OLLAMA", "GROQ", "GEMINI", "MISTRAL");
        }
        if ("GROQ".equalsIgnoreCase(targetEngine) || "LLAMA".equalsIgnoreCase(targetEngine)) {
            return List.of("GROQ", "OLLAMA", "GEMINI", "MISTRAL");
        }
        if ("MISTRAL".equalsIgnoreCase(targetEngine) || "OPENROUTER".equalsIgnoreCase(targetEngine)) {
            return List.of("MISTRAL", "GROQ", "OLLAMA", "GEMINI");
        }
        // Default (or GEMINI)
        return List.of("GEMINI", "GROQ", "OLLAMA", "MISTRAL");
    }

    private String getEngineDisplayName(String engineKey) {
        if (engineKey == null) return "AI Engine";
        if ("OLLAMA".equalsIgnoreCase(engineKey)) return "Ollama (Local LLM)";
        if ("GROQ".equalsIgnoreCase(engineKey) || "LLAMA".equalsIgnoreCase(engineKey)) return "GroqCloud";
        if ("MISTRAL".equalsIgnoreCase(engineKey) || "OPENROUTER".equalsIgnoreCase(engineKey)) return "Mistral AI / OpenRouter";
        if ("GEMINI".equalsIgnoreCase(engineKey)) return "Google Gemini";
        if ("LOCAL".equalsIgnoreCase(engineKey)) return "Local Deterministic Engine";
        return engineKey;
    }
}

