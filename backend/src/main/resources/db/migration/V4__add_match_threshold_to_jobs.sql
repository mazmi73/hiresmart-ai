-- HireSmart AI Database Schema Migration V4
-- Add High Compatibility Match Threshold to Job Offers and remove from system_configs

ALTER TABLE job_offers 
ADD COLUMN IF NOT EXISTS match_threshold INTEGER NOT NULL DEFAULT 70;

-- Remove global threshold from system_configs as threshold is now configured per job offer by recruiters
DELETE FROM system_configs WHERE config_key = 'AI_MATCH_THRESHOLD';
