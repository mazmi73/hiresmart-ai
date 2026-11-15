-- HireSmart AI Database Schema Migration V9
-- Add API Key configuration entries for Gemini, OpenAI (ChatGPT), and Claude (Anthropic)

INSERT INTO system_configs (config_key, config_value, description, updated_at)
VALUES 
('GEMINI_API_KEY', '', 'Google Gemini API Key for Cloud LLM Analysis (AIzaSy...)', CURRENT_TIMESTAMP),
('OPENAI_API_KEY', '', 'OpenAI API Key for ChatGPT Analysis (sk-...)', CURRENT_TIMESTAMP),
('CLAUDE_API_KEY', '', 'Anthropic API Key for Claude Analysis (sk-ant-...)', CURRENT_TIMESTAMP)
ON CONFLICT (config_key) DO NOTHING;
