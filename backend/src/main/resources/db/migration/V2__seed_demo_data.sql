-- HireSmart AI Database Seed Data Migration V2
-- Initial demonstration accounts, jobs, and candidate profiles

-- Passwords:
-- recruiter@hiresmart.ai -> Recruiter123! ($2a$10$D8bK2K0iXw5X3G8Q2vV8e.PzZq5lqE7z2q5lqE7z2q5lqE7z2q5lq)
-- candidate@hiresmart.ai -> Candidate123!
-- Note: Spring Boot DataInitializer also verifies/refreshes seed users with current encoder

INSERT INTO users (id, email, password, role, created_at, updated_at)
VALUES 
(1, 'recruiter@hiresmart.ai', '$2a$10$GZLw0K0Z.q5U7O0BwM6rI.cMhL51Y2u8Ew6F2k4G9Q0J3P7B2D8C6', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'candidate@hiresmart.ai', '$2a$10$GZLw0K0Z.q5U7O0BwM6rI.cMhL51Y2u8Ew6F2k4G9Q0J3P7B2D8C6', 'CANDIDATE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'john.doe@example.com', '$2a$10$GZLw0K0Z.q5U7O0BwM6rI.cMhL51Y2u8Ew6F2k4G9Q0J3P7B2D8C6', 'CANDIDATE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

INSERT INTO recruiter_profiles (id, user_id, company_name, company_description, website, location, created_at, updated_at)
VALUES 
(1, 1, 'TechNova Innovations', 'Next-generation cloud and enterprise AI engineering partner based in Paris and San Francisco.', 'https://technova.io', 'Paris, France (Hybrid)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO candidate_profiles (id, user_id, first_name, last_name, phone, title, education, experience_summary, skills, created_at, updated_at)
VALUES 
(1, 2, 'Alex', 'Vance', '+33 6 12 34 56 78', 'Senior Full-Stack Engineer', 'M.Sc. in Computer Science - Software Engineering (2022)', '4+ years crafting resilient distributed web applications with Spring Boot, Angular, and reactive microservices.', 'Java, Spring Boot, Angular, TypeScript, PostgreSQL, Docker, REST APIs, Git', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 3, 'John', 'Doe', '+33 6 98 76 54 32', 'Backend Software Developer', 'B.Sc. in Information Technology', '3 years building scalable Java APIs, relational database schemas, and microservice architectures.', 'Java, Spring Boot, SQL, PostgreSQL, Git, Maven', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (user_id) DO NOTHING;

-- Jobs
INSERT INTO job_offers (id, recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, created_at, updated_at)
VALUES 
(1, 1, 'Senior Full-Stack Engineer', 'We are looking for a skilled Senior Full-Stack Engineer to architect and build our next-generation cloud recruitment analytics platform. You will collaborate with product designers and cloud engineers to deliver high-performance microservices and dynamic Angular interfaces.', 'TechNova Innovations', 'Paris, France (Hybrid)', 'FULL_TIME', 'SENIOR', 'Java, Spring Boot, Angular, Docker, PostgreSQL', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 'Frontend Angular Specialist', 'Join our frontend core team building lightning-fast interactive dashboards. You will implement reactive forms, state management, and modern Tailwind CSS design systems.', 'TechNova Innovations', 'Remote (Europe)', 'FULL_TIME', 'MID_LEVEL', 'Angular, TypeScript, Tailwind CSS, REST APIs, Git', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 'Backend Java & Cloud Engineer', 'Architect robust RESTful APIs and secure data pipelines. You will optimize PostgreSQL queries, deploy containerized Spring Boot applications, and ensure high test coverage.', 'TechNova Innovations', 'Lyon, France (On-site)', 'FULL_TIME', 'SENIOR', 'Java, Spring Boot, PostgreSQL, Docker, AWS', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 'Junior DevOps & Integration Intern', 'Exciting internship opportunity for engineering students to work on Docker Compose orchestrations, CI/CD pipelines, and automated test suites.', 'TechNova Innovations', 'Paris, France (On-site)', 'INTERNSHIP', 'JUNIOR', 'Docker, Git, Linux, CI/CD', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence numbers
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('candidate_profiles_id_seq', (SELECT COALESCE(MAX(id), 1) FROM candidate_profiles));
SELECT setval('recruiter_profiles_id_seq', (SELECT COALESCE(MAX(id), 1) FROM recruiter_profiles));
SELECT setval('job_offers_id_seq', (SELECT COALESCE(MAX(id), 1) FROM job_offers));
