package com.hiresmart.service;

import com.hiresmart.entity.CVDocument;
import com.hiresmart.entity.SystemConfig;
import com.hiresmart.entity.User;
import com.hiresmart.exception.BadRequestException;
import com.hiresmart.exception.ResourceNotFoundException;
import com.hiresmart.repository.CVDocumentRepository;
import com.hiresmart.repository.SystemConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CvStorageService {

    private static final Logger logger = LoggerFactory.getLogger(CvStorageService.class);

    @Value("${hiresmart.upload.dir:/app/uploads/cvs}")
    private String uploadDir;

    private final CVDocumentRepository cvDocumentRepository;
    private final PdfExtractionService pdfExtractionService;
    private final SystemConfigRepository systemConfigRepository;

    public CvStorageService(CVDocumentRepository cvDocumentRepository,
                            PdfExtractionService pdfExtractionService,
                            SystemConfigRepository systemConfigRepository) {
        this.cvDocumentRepository = cvDocumentRepository;
        this.pdfExtractionService = pdfExtractionService;
        this.systemConfigRepository = systemConfigRepository;
    }

    @Transactional
    public CVDocument storeCv(User candidate, MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded CV file cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new BadRequestException("Filename cannot be empty");
        }

        // Retrieve dynamic allowed extensions from system config (e.g. pdf, doc, docx, txt, rtf, odt)
        String allowedConfig = systemConfigRepository.findByConfigKey("ALLOWED_EXTENSIONS")
                .map(SystemConfig::getConfigValue)
                .orElse("pdf, doc, docx, txt, rtf, odt");

        Set<String> allowedSet = Arrays.stream(allowedConfig.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .map(s -> s.startsWith(".") ? s.substring(1) : s)
                .collect(Collectors.toSet());

        String fileExt = "";
        int dotIdx = originalFilename.lastIndexOf('.');
        if (dotIdx >= 0) {
            fileExt = originalFilename.substring(dotIdx + 1).toLowerCase().trim();
        }

        boolean isPdfMime = "application/pdf".equalsIgnoreCase(file.getContentType());
        if (!allowedSet.contains(fileExt) && !(allowedSet.contains("pdf") && isPdfMime)) {
            throw new BadRequestException("Document extension '." + fileExt + "' is not allowed. Supported formats: " + String.join(", ", allowedSet));
        }

        try {
            Path storageDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(storageDirectory)) {
                Files.createDirectories(storageDirectory);
            }

            // Sanitize filename and prepend unique UUID
            String sanitizedOriginal = originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
            String storedFileName = UUID.randomUUID() + "_" + sanitizedOriginal;
            Path destinationPath = storageDirectory.resolve(storedFileName).normalize();

            // Store file on persistent volume
            Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
            logger.info("Saved candidate CV to persistent storage: {}", destinationPath);

            // Extract plain text
            String extractedText = "";
            if ("pdf".equalsIgnoreCase(fileExt) || isPdfMime) {
                extractedText = pdfExtractionService.extractTextFromPdf(destinationPath.toFile());
            } else {
                try {
                    extractedText = Files.readString(destinationPath, StandardCharsets.UTF_8);
                } catch (Exception ex) {
                    logger.warn("Could not parse file as UTF-8 string: {}", ex.getMessage());
                    extractedText = new String(file.getBytes(), StandardCharsets.ISO_8859_1);
                }
            }

            String contentType = file.getContentType();
            if (contentType == null || contentType.isBlank()) {
                contentType = isPdfMime ? "application/pdf" : "application/octet-stream";
            }

            CVDocument document = new CVDocument();
            document.setCandidate(candidate);
            document.setOriginalFileName(originalFilename);
            document.setFileName(storedFileName);
            document.setFilePath(destinationPath.toString());
            document.setFileSize(file.getSize());
            document.setContentType(contentType);
            document.setExtractedText(extractedText);

            return cvDocumentRepository.save(document);
        } catch (IOException e) {
            logger.error("Failed to store uploaded CV file: {}", e.getMessage(), e);
            throw new BadRequestException("Could not store the uploaded CV file: " + e.getMessage());
        }
    }

    public Resource loadCvAsResource(CVDocument cvDocument) {
        try {
            Path filePath = Paths.get(cvDocument.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("CV file not found on disk or is not readable: " + cvDocument.getOriginalFileName());
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Invalid file path for CV: " + cvDocument.getOriginalFileName());
        }
    }

    public CVDocument getCvEntity(Long id) {
        return cvDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CV document not found with id: " + id));
    }
}
