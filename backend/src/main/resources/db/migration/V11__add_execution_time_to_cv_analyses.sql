-- V11: Add execution time tracking to CV analyses
ALTER TABLE cv_analyses ADD COLUMN IF NOT EXISTS execution_time_ms BIGINT;
