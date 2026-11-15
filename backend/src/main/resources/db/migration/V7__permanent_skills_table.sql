-- HireSmart AI Database Schema Migration V7
-- Permanent Skills Registry: Independent table to persist all historical and future skills
-- Skills remain in this registry permanently even if no job offers currently reference them.

CREATE TABLE IF NOT EXISTS skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    normalized_name VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skills_normalized ON skills(normalized_name);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);

-- 1. Extract and permanently seed all skills from existing job offers
INSERT INTO skills (name, normalized_name, created_at)
SELECT 
    MIN(TRIM(skill)) AS name, 
    LOWER(TRIM(skill)) AS normalized_name, 
    CURRENT_TIMESTAMP
FROM job_offers, 
     LATERAL regexp_split_to_table(required_skills, '[,;]+') AS skill
WHERE TRIM(skill) <> ''
GROUP BY LOWER(TRIM(skill))
ON CONFLICT (normalized_name) DO NOTHING;

-- 2. Extract and permanently seed all skills from existing candidate profiles
INSERT INTO skills (name, normalized_name, created_at)
SELECT 
    MIN(TRIM(skill)) AS name, 
    LOWER(TRIM(skill)) AS normalized_name, 
    CURRENT_TIMESTAMP
FROM candidate_profiles, 
     LATERAL regexp_split_to_table(skills, '[,;]+') AS skill
WHERE TRIM(skill) <> ''
GROUP BY LOWER(TRIM(skill))
ON CONFLICT (normalized_name) DO NOTHING;

-- 3. Seed canonical foundational skills across technical and business domains
INSERT INTO skills (name, normalized_name, created_at)
VALUES 
    ('Java', 'java', CURRENT_TIMESTAMP),
    ('Spring Boot', 'spring boot', CURRENT_TIMESTAMP),
    ('Angular', 'angular', CURRENT_TIMESTAMP),
    ('React', 'react', CURRENT_TIMESTAMP),
    ('TypeScript', 'typescript', CURRENT_TIMESTAMP),
    ('JavaScript', 'javascript', CURRENT_TIMESTAMP),
    ('PostgreSQL', 'postgresql', CURRENT_TIMESTAMP),
    ('Docker', 'docker', CURRENT_TIMESTAMP),
    ('Git', 'git', CURRENT_TIMESTAMP),
    ('REST APIs', 'rest apis', CURRENT_TIMESTAMP),
    ('SQL', 'sql', CURRENT_TIMESTAMP),
    ('Python', 'python', CURRENT_TIMESTAMP),
    ('AWS', 'aws', CURRENT_TIMESTAMP),
    ('Azure', 'azure', CURRENT_TIMESTAMP),
    ('GCP', 'gcp', CURRENT_TIMESTAMP),
    ('Kubernetes', 'kubernetes', CURRENT_TIMESTAMP),
    ('Tailwind CSS', 'tailwind css', CURRENT_TIMESTAMP),
    ('Linux', 'linux', CURRENT_TIMESTAMP),
    ('CI/CD', 'ci/cd', CURRENT_TIMESTAMP),
    ('Maven', 'maven', CURRENT_TIMESTAMP),
    ('Hibernate', 'hibernate', CURRENT_TIMESTAMP),
    ('Node.js', 'node.js', CURRENT_TIMESTAMP),
    ('HTML/CSS', 'html/css', CURRENT_TIMESTAMP),
    ('GraphQL', 'graphql', CURRENT_TIMESTAMP),
    ('MongoDB', 'mongodb', CURRENT_TIMESTAMP),
    ('Redis', 'redis', CURRENT_TIMESTAMP),
    ('C#', 'c#', CURRENT_TIMESTAMP),
    ('C++', 'c++', CURRENT_TIMESTAMP),
    ('Agile/Scrum', 'agile/scrum', CURRENT_TIMESTAMP),
    ('Unit Testing', 'unit testing', CURRENT_TIMESTAMP),
    ('B2B Sales', 'b2b sales', CURRENT_TIMESTAMP),
    ('Business Development', 'business development', CURRENT_TIMESTAMP),
    ('Project Management', 'project management', CURRENT_TIMESTAMP),
    ('Financial Analysis', 'financial analysis', CURRENT_TIMESTAMP),
    ('Customer Service', 'customer service', CURRENT_TIMESTAMP),
    ('CRM', 'crm', CURRENT_TIMESTAMP),
    ('English Fluency', 'english fluency', CURRENT_TIMESTAMP),
    ('Negotiation', 'negotiation', CURRENT_TIMESTAMP),
    ('Team Leadership', 'team leadership', CURRENT_TIMESTAMP),
    ('Supply Chain', 'supply chain', CURRENT_TIMESTAMP),
    ('Digital Marketing', 'digital marketing', CURRENT_TIMESTAMP),
    ('Data Analysis', 'data analysis', CURRENT_TIMESTAMP),
    ('Risk Management', 'risk management', CURRENT_TIMESTAMP),
    ('Lean Manufacturing', 'lean manufacturing', CURRENT_TIMESTAMP),
    ('Quality Assurance', 'quality assurance', CURRENT_TIMESTAMP),
    ('Actuarial Science', 'actuarial science', CURRENT_TIMESTAMP),
    ('Insurance Underwriting', 'insurance underwriting', CURRENT_TIMESTAMP)
ON CONFLICT (normalized_name) DO NOTHING;
