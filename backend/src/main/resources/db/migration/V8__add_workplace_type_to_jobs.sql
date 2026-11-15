-- HireSmart AI Database Schema Migration V8
-- Add workplace_type to job_offers (ON_SITE, HYBRID, REMOTE)

ALTER TABLE job_offers 
ADD COLUMN IF NOT EXISTS workplace_type VARCHAR(50) NOT NULL DEFAULT 'ON_SITE';

-- Infer workplace_type for existing jobs from location or title
UPDATE job_offers 
SET workplace_type = 'REMOTE' 
WHERE LOWER(location) LIKE '%remote%' OR LOWER(title) LIKE '%remote%';

UPDATE job_offers 
SET workplace_type = 'HYBRID' 
WHERE LOWER(location) LIKE '%hybrid%' OR LOWER(title) LIKE '%hybrid%';
