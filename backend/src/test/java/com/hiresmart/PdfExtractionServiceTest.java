package com.hiresmart;

import com.hiresmart.service.PdfExtractionService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

public class PdfExtractionServiceTest {

    private final PdfExtractionService pdfExtractionService = new PdfExtractionService();

    @Test
    @DisplayName("Should extract text from real generated PDF file using Apache PDFBox")
    void testPdfTextExtraction(@TempDir Path tempDir) throws IOException {
        File pdfFile = tempDir.resolve("synthetic_candidate_cv.pdf").toFile();

        // Create a synthetic PDF document programmatically using PDFBox
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
                contentStream.newLineAtOffset(50, 700);
                contentStream.showText("ALEX VANCE - SOFTWARE ENGINEER");
                contentStream.newLineAtOffset(0, -30);
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                contentStream.showText("Core Competencies: Java, Spring Boot, Angular, Git");
                contentStream.endText();
            }

            document.save(pdfFile);
        }

        assertTrue(pdfFile.exists(), "Synthetic PDF file must exist");

        // When
        String extractedText = pdfExtractionService.extractTextFromPdf(pdfFile);

        // Then
        assertNotNull(extractedText);
        assertTrue(extractedText.contains("ALEX VANCE"), "Extracted text must contain candidate name");
        assertTrue(extractedText.contains("Java"), "Extracted text must contain Java");
        assertTrue(extractedText.contains("Spring Boot"), "Extracted text must contain Spring Boot");
        assertTrue(extractedText.contains("Angular"), "Extracted text must contain Angular");
    }
}
