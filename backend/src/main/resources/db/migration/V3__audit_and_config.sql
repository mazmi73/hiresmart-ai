-- HireSmart AI Database Schema Migration V3
-- Audit Logs and System Configuration for Platform Administration

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50),
    target_resource VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS system_configs (
    id BIGSERIAL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed default system configurations
INSERT INTO system_configs (config_key, config_value, description, updated_at)
VALUES 
('AI_ENGINE', 'LOCAL', 'Active AI parsing engine: LOCAL (Apache PDFBox TF-IDF) or GEMINI (Google Gemini 1.5 Flash)', CURRENT_TIMESTAMP),
('AI_MATCH_THRESHOLD', '70', 'Minimum compatibility percentage threshold required for High Match badges', CURRENT_TIMESTAMP),
('MAX_CV_SIZE_MB', '10', 'Maximum allowed CV upload size in megabytes', CURRENT_TIMESTAMP),
('ALLOWED_EXTENSIONS', 'pdf', 'Comma-separated list of allowed CV file extensions', CURRENT_TIMESTAMP),
('REGISTRATION_OPEN', 'true', 'Whether public user registration is enabled on the platform', CURRENT_TIMESTAMP),
('MAINTENANCE_MODE', 'false', 'Platform maintenance mode state flag', CURRENT_TIMESTAMP)
ON CONFLICT (config_key) DO NOTHING;

-- Seed initial audit log trail entries
INSERT INTO audit_logs (action, actor_email, actor_role, target_resource, details, created_at)
VALUES 
('SYSTEM_STARTUP', 'system@hiresmart.ai', 'SYSTEM', 'Platform Kernel', 'HireSmart AI Modular Monolith platform initialized successfully.', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('ADMIN_SEEDED', 'system@hiresmart.ai', 'SYSTEM', 'User Management', 'Default platform administrator account provisioned: admin@hiresmart.ai', CURRENT_TIMESTAMP - INTERVAL '50 minutes'),
('JOB_CREATED', 'recruiter@hiresmart.ai', 'RECRUITER', 'Job Offer #1', 'Senior Full-Stack Engineer job offer posted by TechNova Innovations', CURRENT_TIMESTAMP - INTERVAL '40 minutes'),
('APPLICATION_SUBMITTED', 'candidate@hiresmart.ai', 'CANDIDATE', 'Application #1', 'Alex Vance applied to Senior Full-Stack Engineer position', CURRENT_TIMESTAMP - INTERVAL '25 minutes'),
('AI_ANALYSIS_COMPLETED', 'system@hiresmart.ai', 'SYSTEM', 'AI Engine', 'Apache PDFBox completed CV parsing and skill match scoring for candidate Alex Vance', CURRENT_TIMESTAMP - INTERVAL '20 minutes');
