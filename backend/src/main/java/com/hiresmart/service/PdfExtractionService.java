package com.hiresmart.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class PdfExtractionService {

    private static final Logger logger = LoggerFactory.getLogger(PdfExtractionService.class);

    public String extractTextFromPdf(File pdfFile) {
        if (pdfFile == null || !pdfFile.exists()) {
            logger.warn("PDF file is null or does not exist");
            return "";
        }

        try (PDDocument document = Loader.loadPDF(pdfFile)) {
            if (document.isEncrypted()) {
                logger.warn("PDF document is encrypted, cannot extract text directly");
                return "[Encrypted PDF document. Please upload an unencrypted document.]";
            }

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String text = stripper.getText(document);

            if (text == null || text.trim().isEmpty()) {
                logger.info("PDF has 0 extractable text characters (likely scanned or raster image)");
                return "[No extractable text detected. This document appears to be a scanned image or contains non-extractable text fonts.]";
            }

            logger.info("Successfully extracted {} characters from PDF: {}", text.length(), pdfFile.getName());
            return text.trim();
        } catch (IOException e) {
            logger.error("Error extracting text from PDF file {}: {}", pdfFile.getName(), e.getMessage());
            return "[Error reading PDF document text: " + e.getMessage() + "]";
        }
    }
}
