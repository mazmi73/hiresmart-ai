-- HireSmart AI Database Schema Migration V10
-- Replace OpenAI and Claude configs with free-tier providers Groq (Llama 3.3) and Mistral AI

DELETE FROM system_configs WHERE config_key IN ('OPENAI_API_KEY', 'CLAUDE_API_KEY');

UPDATE cv_analyses SET ai_provider = 'LOCAL' WHERE ai_provider IN ('OPENAI', 'CLAUDE');

INSERT INTO system_configs (config_key, config_value, description, updated_at)
VALUES 
('GROQ_API_KEY', '', 'GroqCloud API Key for Meta Llama 3.3 70B Analysis (gsk_...)', CURRENT_TIMESTAMP),
('MISTRAL_API_KEY', '', 'Mistral AI API Key for Mistral Small Analysis', CURRENT_TIMESTAMP)
ON CONFLICT (config_key) DO NOTHING;
