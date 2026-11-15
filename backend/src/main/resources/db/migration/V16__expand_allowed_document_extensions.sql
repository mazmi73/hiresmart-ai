-- Flyway Migration V16: Expand allowed document extensions in system configuration
UPDATE system_configs 
SET config_value = 'pdf, doc, docx, txt, rtf, odt',
    description = 'Comma-separated list of allowed CV file extensions (pdf, doc, docx, txt, rtf, odt)',
    updated_at = CURRENT_TIMESTAMP
WHERE config_key = 'ALLOWED_EXTENSIONS';
