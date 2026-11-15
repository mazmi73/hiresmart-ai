-- HireSmart AI Database Schema Migration V5
-- Popular Recruiting Companies in Morocco and Realistic Job Offers across Diverse Tech Domains
-- Standard password for all seeded recruiter accounts: Recruiter123!
-- BCrypt Hash: $2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u

-- ============================================================================
-- 1. PROVISION RECRUITER ACCOUNTS
-- ============================================================================

INSERT INTO users (email, password, role, created_at, updated_at)
VALUES 
-- Capgemini (update password to Recruiter123! for uniform login access)
('capgemini@gmail.com', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 10 Leading Moroccan Employers
('ocp@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('attijariwafa@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('maroctelecom@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cgi@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('orange@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('inwi@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bankofafrica@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dxc@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sofrecom@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('thales@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password, updated_at = CURRENT_TIMESTAMP;

-- ============================================================================
-- 2. CREATE / UPDATE RECRUITER COMPANY PROFILES
-- ============================================================================

-- Capgemini Engineering Morocco
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'Capgemini Engineering', 'Global leader in partnering with companies to transform and manage their business by harnessing the power of technology. Delivering cutting-edge IT and engineering solutions from Casablanca and Rabat delivery centers.', 'https://www.capgemini.com/ma-en/', 'Casablanca & Rabat', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'capgemini@gmail.com'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- OCP Group
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'OCP Group', 'World leader in plant nutrition and phosphate solutions, pioneering digital agriculture, green tech, industrial IoT, and enterprise cloud systems across Morocco and Africa.', 'https://www.ocpgroup.ma', 'Casablanca / Benguerir / Jorf Lasfar', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'ocp@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- Attijariwafa Bank
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'Attijariwafa Bank', 'Leading pan-African banking and financial group operating in 26 countries, driving innovative FinTech solutions, digital payment channels, and modern microservices.', 'https://www.attijariwafabank.com', 'Casablanca Finance City', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'attijariwafa@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- Maroc Telecom (IAM)
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'Maroc Telecom', 'Historical and primary telecommunications operator in Morocco, leading nation-wide fiber, 5G architectures, cloud infrastructure, and enterprise data networks.', 'https://www.iam.ma', 'Rabat (Avenue Annakhil)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'maroctelecom@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- CGI Morocco
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'CGI Morocco', 'Leading global IT and business consulting services firm with high-performing centers of excellence in Casablanca and Rabat delivering digital transformation across EMEA.', 'https://www.cgi.com/morocco', 'Casablanca Nearshore & Rabat Technopolis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'cgi@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- Orange Maroc
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'Orange Maroc', 'Top multi-service digital telecom and tech operator in Morocco, empowering business and retail clients with cloud platforms, cybersecurity, and digital lifestyle solutions.', 'https://www.orange.ma', 'Casablanca Nearshore', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'orange@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- inwi (Wana Corporate)
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'inwi', 'Dynamic Moroccan telecommunications and cloud services operator providing advanced telecom infrastructure, national sovereign data centers, and digital streaming platforms.', 'https://www.inwi.ma', 'Casablanca (Sidi Maarouf)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'inwi@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- Bank of Africa (BMCE Group)
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'Bank of Africa', 'Pan-African commercial bank offering cutting-edge digital banking, wealth management, open banking APIs, and international trade finance technology.', 'https://www.bankofafrica.ma', 'Casablanca (Hassan II)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'bankofafrica@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- DXC Technology Morocco
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'DXC Technology Morocco', 'Fortune 500 global IT services leader driving modern workplace, enterprise cloud migration, IT outsourcing, and mission-critical application management in Morocco.', 'https://www.dxc.com', 'Rabat Technopolis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'dxc@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- Sofrecom Maroc (Orange Group)
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'Sofrecom Maroc', 'Orange Group consulting and engineering subsidiary specializing in telecommunications software, AI research, cloud native platforms, and network digital twins.', 'https://www.sofrecom.com', 'Casablanca & Rabat Technopolis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'sofrecom@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- Thales Morocco
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'Thales Morocco', 'Global technology leader in aerospace, space, defense, digital identity, and cybersecurity with engineering competence centers in Rabat Technopolis.', 'https://www.thalesgroup.com/morocco', 'Rabat Technopolis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'thales@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;


-- ============================================================================
-- 3. INSERT POPULAR MOROCCAN JOB OFFERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- COMPANY 1: Capgemini Engineering Morocco (Additional 5 jobs)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Senior Java / Spring Cloud Microservices Engineer', 
'Join Capgemini Engineering in Casablanca Shore to design and build mission-critical enterprise microservices for tier-1 international automotive and aerospace clients. You will architect distributed systems with Spring Boot, Docker, and Kafka, ensuring high scalability and resiliency.', 
'Capgemini Engineering', 'Casablanca (Nearshore)', 'FULL_TIME', 'SENIOR', 
'Java, Spring Boot, Spring Cloud, Docker, Kubernetes, PostgreSQL, Kafka, Microservices, Git', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'capgemini@gmail.com';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Cloud DevOps & Platform Automation Specialist', 
'Capgemini Rabat Technopolis is seeking a Cloud DevOps Specialist to automate continuous integration and continuous deployment pipelines across AWS and Azure. You will implement Infrastructure as Code using Terraform, Helm, and maintain Kubernetes container clusters.', 
'Capgemini Engineering', 'Rabat Technopolis', 'FULL_TIME', 'MID_LEVEL', 
'AWS, Terraform, Docker, Kubernetes, CI/CD, Linux, GitLab, Python, Bash', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'capgemini@gmail.com';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Lead Frontend Engineer (Angular 18 & TypeScript)', 
'Lead frontend technical direction on large-scale web applications. You will create responsive, accessible, and high-performance design systems using Angular 18, RxJS, Tailwind CSS, and state management libraries with strong unit and integration testing.', 
'Capgemini Engineering', 'Casablanca (Hybrid)', 'FULL_TIME', 'LEAD', 
'Angular, TypeScript, RxJS, Tailwind CSS, Jest, HTML5, REST APIs, Git', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'capgemini@gmail.com';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'QA Automation Engineer (Selenium & Python)', 
'We are looking for a QA Automation Engineer to design automated regression test suites for cloud-native web portals. You will integrate automated tests with GitLab CI/CD, report metrics in JIRA, and collaborate closely with software engineering squads.', 
'Capgemini Engineering', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Python, Selenium, TestNG, PostgreSQL, CI/CD, JIRA, Docker, Git', 
'ACTIVE', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'capgemini@gmail.com';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Cybersecurity Incident & SOC Analyst', 
'Monitor, detect, and respond to cyber security incidents across international enterprise networks. You will configure SIEM rules, perform threat hunting, analyze logs with Splunk, and ensure adherence to ISO 27001 cybersecurity frameworks.', 
'Capgemini Engineering', 'Rabat Technopolis', 'FULL_TIME', 'SENIOR', 
'SIEM, Splunk, Linux, Python, Network Security, ISO 27001, Firewall, Wireshark', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'capgemini@gmail.com';


-- ----------------------------------------------------------------------------
-- COMPANY 2: OCP Group (5 jobs)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Senior Industrial IoT & Embedded Systems Architect', 
'OCP Group is expanding its smart industrial initiatives at UM6P Benguerir. You will architect sensor telemetry pipelines, edge computing units, and real-time MQTT data streaming to optimize global manufacturing and chemical processing plants.', 
'OCP Group', 'Benguerir (UM6P Campus)', 'FULL_TIME', 'SENIOR', 
'Python, C++, IoT, MQTT, Docker, Linux, Time Series DB, Azure IoT, Git', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'ocp@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Lead AI & Machine Learning Scientist', 
'Lead research and operational deployment of predictive AI models for agronomy and predictive plant maintenance. You will build deep learning architectures, deploy models with MLOps pipelines, and collaborate with domain agronomists and process engineers.', 
'OCP Group', 'Casablanca / Benguerir', 'FULL_TIME', 'LEAD', 
'Python, TensorFlow, PyTorch, Scikit-learn, SQL, Docker, MLOps, Pandas, Git', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'ocp@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Big Data & Streaming Platform Engineer', 
'Design and maintain enterprise-scale distributed data lakes processing millions of industrial telemetry events per second. You will implement data ingestion using Apache Kafka, Apache Spark, and ensure zero-downtime query performance on PostgreSQL and Data Lakehouse.', 
'OCP Group', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Apache Spark, Kafka, Python, PostgreSQL, Hadoop, Docker, SQL, Linux', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'ocp@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Enterprise Cloud Infrastructure Engineer', 
'Ensure reliable, secure, and automated cloud computing infrastructure across OCP production facilities. You will implement automated provisioning with Terraform and Ansible on Azure Cloud, with strict compliance and high-availability SLA standards.', 
'OCP Group', 'Jorf Lasfar', 'FULL_TIME', 'MID_LEVEL', 
'Azure, Linux, Terraform, Kubernetes, Ansible, Bash, CI/CD, Git', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'ocp@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Junior Supply Chain Tech & Python Developer (PFE / Graduate)', 
'Kickstart your career within OCP digital acceleration program. You will collaborate on internal logistics web tools, write clean Python backend scripts, build reporting dashboards, and optimize supply chain resource allocation.', 
'OCP Group', 'Casablanca', 'INTERNSHIP', 'JUNIOR', 
'Python, SQL, Django, PostgreSQL, Git, Excel, REST APIs, Linux', 
'ACTIVE', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'ocp@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- COMPANY 3: Attijariwafa Bank (5 jobs)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'FinTech Java & Microservices Core Banking Engineer', 
'Attijariwafa Bank is modernizing its core transactional banking engine in Casablanca Finance City. You will build highly secure, low-latency Java Spring Boot microservices handling multi-currency payments, credit authorizations, and instant money transfers.', 
'Attijariwafa Bank', 'Casablanca Finance City', 'FULL_TIME', 'SENIOR', 
'Java, Spring Boot, Kafka, PostgreSQL, Docker, Microservices, Kubernetes, REST APIs', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'attijariwafa@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Mobile Banking iOS Developer (Swift)', 
'Develop flagship retail banking and wealth management mobile applications for millions of active retail customers across Morocco. You will build modular native Swift features, integrate biometric authentication, and implement top-tier OWASP mobile security guidelines.', 
'Attijariwafa Bank', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Swift, iOS, Xcode, REST APIs, Git, Clean Architecture, CI/CD, Mobile Security', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'attijariwafa@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Mobile Banking Android Developer (Kotlin)', 
'Join our mobile engineering center to craft high-performance Android banking applications. You will leverage modern Android architecture (Jetpack Compose, Coroutines, Flow), write unit tests, and deliver intuitive banking experiences.', 
'Attijariwafa Bank', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Kotlin, Android SDK, Jetpack Compose, Coroutines, REST APIs, Git, Mobile Security', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'attijariwafa@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'DevSecOps & Banking Cloud Security Specialist', 
'Embed automated security controls and code analysis into banking CI/CD pipelines. You will configure HashiCorp Vault for secrets management, perform SonarQube static analysis, and maintain compliant container runtimes on Kubernetes.', 
'Attijariwafa Bank', 'Casablanca Finance City', 'FULL_TIME', 'SENIOR', 
'DevSecOps, SonarQube, Docker, Kubernetes, Linux, Vault, CI/CD, Java, Security', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'attijariwafa@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Business Intelligence & Financial Data Analyst', 
'Analyze banking customer portfolios, credit risk indicators, and deposit growth trends. You will build Power BI dashboards, write performant SQL queries against relational data warehouses, and generate regulatory risk reports.', 
'Attijariwafa Bank', 'Casablanca', 'FULL_TIME', 'JUNIOR', 
'SQL, Power BI, Python, PostgreSQL, ETL, Data Warehousing, Financial Modeling', 
'ACTIVE', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'attijariwafa@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- COMPANY 4: Maroc Telecom (IAM) (5 jobs)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Telecom IP Core & 5G Virtualization Engineer', 
'Maroc Telecom is recruiting a Senior Telecom IP Core Engineer in Rabat to deploy virtualized network functions (VNF) and manage 5G standalone core infrastructure. You will oversee routing protocols, MPLS backbone stability, and SDN orchestration.', 
'Maroc Telecom', 'Rabat', 'FULL_TIME', 'SENIOR', 
'5G, IP Networks, Linux, Python, OpenStack, Docker, SDN, NFV, Cisco, BGP', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'maroctelecom@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Senior Fullstack Web Portal Engineer (React & Java)', 
'Develop self-care customer portals and internal B2B service management systems. You will build user-friendly React interfaces, implement secure Spring Boot APIs, and integrate with billing and telecom provisioning backends.', 
'Maroc Telecom', 'Rabat', 'FULL_TIME', 'MID_LEVEL', 
'React, Java, Spring Boot, PostgreSQL, Docker, REST APIs, Git, JavaScript', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'maroctelecom@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Enterprise Database Administrator (PostgreSQL & Oracle)', 
'Administer mission-critical customer databases containing tens of millions of records. You will handle database partitioning, high availability clustering, performance tuning, automated backup validation, and disaster recovery drills.', 
'Maroc Telecom', 'Rabat', 'FULL_TIME', 'SENIOR', 
'PostgreSQL, Oracle, Linux, Bash, SQL, High Availability, Backup, Performance Tuning', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'maroctelecom@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Network Security & DDoS Defense Specialist', 
'Protect national telecom and internet backbone infrastructure against malicious volumetric DDoS attacks and cyber intrusions. You will configure carrier-grade firewalls, BGP blackholing, inspect packet flows, and participate in 24/7 security duty rotations.', 
'Maroc Telecom', 'Rabat', 'FULL_TIME', 'MID_LEVEL', 
'Firewall, BGP, Network Security, Linux, Python, Wireshark, SIEM, DDoS Defense', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'maroctelecom@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Fiber Optic Network Planning & GIS Engineer', 
'Plan and supervise FTTH (Fiber to the Home) expansion across Moroccan urban and suburban zones. You will use GIS tools to map network routing, analyze optical budget constraints, and coordinate rollout with field deployment teams.', 
'Maroc Telecom', 'Casablanca / Rabat', 'FULL_TIME', 'JUNIOR', 
'GIS, AutoCAD, Fiber Optics, Network Planning, Excel, SQL, Project Management', 
'ACTIVE', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'maroctelecom@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- COMPANY 5: CGI Morocco (5 jobs)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Fullstack Java & Angular Developer', 
'Join CGI Casablanca Nearshore to deliver cutting-edge enterprise software for European and North American clients. You will write clean, well-tested code using Spring Boot and Angular, participating in daily agile ceremonies and continuous deployments.', 
'CGI Morocco', 'Casablanca Nearshore', 'FULL_TIME', 'MID_LEVEL', 
'Java, Spring Boot, Angular, TypeScript, PostgreSQL, Docker, Git, REST APIs', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'cgi@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Salesforce CRM & Cloud Integration Consultant', 
'Design and customize Salesforce CRM implementations for international banking and insurance clients. You will build Apex triggers, Lightning Web Components (LWC), and integrate Salesforce with external REST APIs and enterprise ERP systems.', 
'CGI Morocco', 'Rabat Technopolis', 'FULL_TIME', 'SENIOR', 
'Salesforce, Apex, Lightning Web Components, REST APIs, SQL, Agile, Git', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'cgi@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'QA Test Automation Engineer (Java / Cucumber)', 
'Champion test automation quality standards within our center of excellence. You will build robust end-to-end regression frameworks with Selenium and Cucumber, analyze test execution results, and mentor junior QA analysts.', 
'CGI Morocco', 'Casablanca Nearshore', 'FULL_TIME', 'MID_LEVEL', 
'Java, Selenium, Cucumber, JUnit, CI/CD, Git, JIRA, Test Automation', 
'ACTIVE', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'cgi@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Azure Cloud & Kubernetes Architect', 
'Architect scalable, highly resilient cloud landing zones on Microsoft Azure. You will collaborate with enterprise architects, define container management patterns with AKS, automate infrastructure with Terraform, and guide cloud adoption strategies.', 
'CGI Morocco', 'Casablanca (Hybrid)', 'FULL_TIME', 'LEAD', 
'Azure, Kubernetes, Docker, Terraform, CI/CD, Linux, Helm, Cloud Architecture', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'cgi@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Scrum Master / Agile Delivery Lead', 
'Drive high-performance delivery across cross-functional engineering teams. You will facilitate sprint ceremonies, eliminate impediments, coach squads on Scrum and Kanban principles, and communicate milestone metrics to international stakeholders.', 
'CGI Morocco', 'Rabat Technopolis', 'FULL_TIME', 'SENIOR', 
'Scrum, Agile, JIRA, Confluence, CI/CD, Kanban, Leadership, Coaching', 
'ACTIVE', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'cgi@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- COMPANY 6: Orange Maroc (5 jobs)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Digital Transformation Fullstack Developer (React & Node.js)', 
'Orange Maroc is accelerating its digital consumer experience. You will build dynamic, mobile-responsive web applications using React, Tailwind CSS, and Node.js microservices deployed on sovereign cloud infrastructure in Casablanca.', 
'Orange Maroc', 'Casablanca Nearshore', 'FULL_TIME', 'MID_LEVEL', 
'React, Node.js, TypeScript, PostgreSQL, Docker, REST APIs, Tailwind CSS, Git', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'orange@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Network Automation & SRE Engineer (Python & Ansible)', 
'Automate telecom routing configurations and monitor production health. You will write Python scripts, design Ansible playbooks for automated switch and router management, and build real-time monitoring dashboards with Prometheus and Grafana.', 
'Orange Maroc', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Python, Ansible, Linux, Prometheus, Grafana, Docker, REST APIs, Networking', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'orange@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'AWS Cloud Solutions Architect', 
'Lead the design and migration of mission-critical applications to AWS Cloud. You will establish security baselines, optimize cloud spending with FinOps practices, and guide developers on serverless and containerized deployment architectures.', 
'Orange Maroc', 'Casablanca (Hybrid)', 'FULL_TIME', 'LEAD', 
'AWS, Terraform, Python, Docker, Kubernetes, Linux, CloudFormation, Microservices', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'orange@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Cybersecurity SOC Level 2 Incident Responder', 
'Investigate advanced persistent threats, suspicious network anomalies, and malware alerts. You will coordinate with internal infrastructure teams, perform digital forensics, and enhance automated detection rules in our 24/7 Security Operations Center.', 
'Orange Maroc', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'SOC, SIEM, Incident Response, Linux, Python, Wireshark, Threat Hunting, Cybersecurity', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'orange@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Digital Product Owner / Mobile Experience', 
'Drive the product roadmap for Orange Maroc mobile apps. You will prioritize product backlogs, analyze user analytics, define detailed user stories, and work alongside UX designers and mobile developers to maximize customer satisfaction.', 
'Orange Maroc', 'Casablanca', 'FULL_TIME', 'SENIOR', 
'Product Management, Agile, Scrum, JIRA, UX Design, Mobile Apps, Analytics', 
'ACTIVE', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'orange@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- COMPANY 7: inwi (Wana Corporate) (5 jobs)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Site Reliability Engineer (SRE & Kubernetes Platform)', 
'inwi is seeking a passionate SRE in Casablanca to maintain high-uptime customer-facing streaming and telecom services. You will manage bare-metal and cloud Kubernetes clusters, automate deployment runbooks, and participate in incident on-call rotations.', 
'inwi', 'Casablanca (Sidi Maarouf)', 'FULL_TIME', 'SENIOR', 
'Kubernetes, Docker, Linux, Python, Prometheus, Grafana, CI/CD, Bash, Git', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'inwi@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Mobile Application Developer (Flutter & Dart)', 
'Craft responsive, beautiful mobile experiences for inwi Myinwi and Win telecom platforms. You will develop cross-platform features with Flutter, integrate native device capabilities, optimize app launch speeds, and write clean unit tests.', 
'inwi', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Flutter, Dart, REST APIs, Firebase, Git, iOS, Android, State Management', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'inwi@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Cloud Data Platform Engineer (Spark & Kafka)', 
'Build modern big data pipelines powering inwi data-driven marketing, network analytics, and real-time charging systems. You will build resilient streaming pipelines with Apache Spark and Kafka, integrating with cloud storage and PostgreSQL.', 
'inwi', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Python, Apache Spark, Kafka, SQL, Docker, Linux, PostgreSQL, Data Engineering', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'inwi@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Telecom BSS / OSS Integration Developer', 
'Develop integration middleware connecting retail mobile apps, dealer portals, and telecom provisioning engines. You will build robust Java Spring Boot microservices and RESTful APIs with strict SLA requirements and high concurrency handling.', 
'inwi', 'Casablanca', 'FULL_TIME', 'SENIOR', 
'Java, Spring Boot, REST APIs, Microservices, SQL, Linux, Docker, Git', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'inwi@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Junior Cloud Systems Administrator (Internship / Entry)', 
'Join inwi sovereign cloud hosting division. You will learn modern data center management, assist with Linux server patching, configure virtual networks, and support enterprise client migrations to our certified Tier III data centers.', 
'inwi', 'Casablanca', 'INTERNSHIP', 'JUNIOR', 
'Linux, Bash, Networking, Virtualization, Docker, Cloud, Git', 
'ACTIVE', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'inwi@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- COMPANY 8: Bank of Africa (BMCE Group) (5 jobs)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Digital Banking Platform Architect (Java & Microservices)', 
'Bank of Africa is recruiting a Lead Platform Architect in Casablanca. You will define the target software architecture for next-generation mobile banking, international trade portals, and API monetization platforms across 20+ African subsidiaries.', 
'Bank of Africa', 'Casablanca', 'FULL_TIME', 'LEAD', 
'Java, Spring Boot, Microservices, Kafka, PostgreSQL, Docker, Kubernetes, Architecture', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'bankofafrica@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Cross-Platform Mobile Engineer (React Native)', 
'Build modern mobile banking interfaces for iOS and Android using React Native and TypeScript. You will collaborate with UI/UX designers, integrate secure banking SDKs, and ensure seamless performance across diverse smartphone models.', 
'Bank of Africa', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'React Native, TypeScript, JavaScript, REST APIs, Redux, iOS, Android, Git', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'bankofafrica@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'IT Risk, Governance & Compliance Officer', 
'Ensure compliance with central bank (Bank Al-Maghrib) IT security directives, GDPR, and ISO 27001 standards. You will conduct IT risk assessments, review third-party vendor security postures, and participate in internal and external audit reviews.', 
'Bank of Africa', 'Casablanca', 'FULL_TIME', 'SENIOR', 
'ISO 27001, IT Governance, Risk Management, Cybersecurity, Audit, PCI-DSS, Compliance', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'bankofafrica@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Big Data Engineer & Analytics Specialist', 
'Develop analytical data marts and automated ETL pipelines for credit risk modeling, customer churn prediction, and anti-money laundering (AML) detection. You will optimize SQL queries and build automated pipelines with Apache Airflow.', 
'Bank of Africa', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'SQL, Python, ETL, Power BI, PostgreSQL, Big Data, Airflow, Data Modeling', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'bankofafrica@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Junior IT Support & Systems Analyst', 
'Support internal bank branch operations and digital workplace tools. You will diagnose software issues, configure Windows and Linux terminals, assist bank branch managers, and document standard troubleshooting operating procedures.', 
'Bank of Africa', 'Casablanca', 'FULL_TIME', 'JUNIOR', 
'Windows Server, Linux, Networking, Active Directory, Troubleshooting, Helpdesk, SQL', 
'ACTIVE', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'bankofafrica@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- COMPANY 9: DXC Technology Morocco (5 jobs)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Enterprise .NET Core & Microservices Engineer', 
'Join DXC Technology Morocco in Rabat Technopolis to build modern cloud-native web APIs and enterprise backends. You will leverage C#, .NET 8, Entity Framework Core, PostgreSQL, and Docker to deliver robust services for global corporate accounts.', 
'DXC Technology Morocco', 'Rabat Technopolis', 'FULL_TIME', 'SENIOR', 
'C#, .NET Core, Microservices, Docker, PostgreSQL, Azure, REST APIs, Git', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'dxc@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'ServiceNow Enterprise Implementation Specialist', 
'Configure and implement ServiceNow IT Service Management (ITSM) and IT Operations Management (ITOM) modules for Fortune 500 customers. You will write client scripts, business rules, and integrate ServiceNow with third-party monitoring tools.', 
'DXC Technology Morocco', 'Rabat Technopolis', 'FULL_TIME', 'MID_LEVEL', 
'ServiceNow, JavaScript, ITIL, REST APIs, SQL, Agile, ITSM', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'dxc@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Enterprise Linux & System Administrator', 
'Administer mission-critical Linux (RHEL, Ubuntu) server farms running in hybrid cloud environments. You will automate routine server provisioning with Ansible, manage storage arrays, and troubleshoot performance bottlenecks.', 
'DXC Technology Morocco', 'Rabat', 'FULL_TIME', 'SENIOR', 
'Linux, RedHat, Bash, Ansible, VMware, Storage, Python, System Administration', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'dxc@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Cloud Migration & Modern Workplace Engineer', 
'Assist international customers in migrating legacy infrastructure to Microsoft Azure and Microsoft 365. You will configure Intune mobile device management, implement Entra ID identity solutions, and automate tasks with PowerShell.', 
'DXC Technology Morocco', 'Rabat (Hybrid)', 'FULL_TIME', 'MID_LEVEL', 
'Microsoft 365, Azure, PowerShell, Active Directory, Windows Server, Cloud Migration', 
'ACTIVE', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'dxc@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Junior Frontend Web Developer (React / TypeScript)', 
'Start your software engineering journey with DXC Technology. You will work within an agile squad building responsive web user interfaces using React and TypeScript, following best practices in code quality and automated testing.', 
'DXC Technology Morocco', 'Rabat Technopolis', 'FULL_TIME', 'JUNIOR', 
'React, TypeScript, JavaScript, HTML5, CSS3, Git, REST APIs', 
'ACTIVE', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'dxc@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- COMPANY 10: Sofrecom Maroc (Orange Group) (5 jobs)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'AI & Natural Language Processing (NLP) Engineer', 
'Sofrecom Maroc is developing next-generation conversational AI and customer sentiment engines for Orange Group. You will train and fine-tune transformer models, implement semantic search, and deploy scalable FastAPI model serving containers.', 
'Sofrecom Maroc', 'Casablanca Nearshore', 'FULL_TIME', 'SENIOR', 
'Python, NLP, PyTorch, Transformers, HuggingFace, FastAPI, Docker, Git', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'sofrecom@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Fullstack Python / Django & React Engineer', 
'Build modular web platforms powering telecom network operations and inventory management. You will write robust Python Django backend code, design intuitive React user experiences, and integrate with relational PostgreSQL databases.', 
'Sofrecom Maroc', 'Rabat Technopolis', 'FULL_TIME', 'MID_LEVEL', 
'Python, Django, React, TypeScript, PostgreSQL, Docker, Git, REST APIs', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'sofrecom@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'DevOps & Cloud Native Platform Engineer', 
'Maintain high-performing CI/CD pipelines and Kubernetes infrastructure for software development squads. You will automate deployments with GitLab CI, manage Helm charts, and establish centralized logging with the ELK stack.', 
'Sofrecom Maroc', 'Casablanca Nearshore', 'FULL_TIME', 'MID_LEVEL', 
'Kubernetes, Docker, Helm, GitLab CI, Linux, Terraform, Prometheus, CI/CD', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'sofrecom@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'API Management & Microservices Specialist', 
'Design and secure enterprise API gateways exposing telecom capabilities to third-party partners. You will define OpenAPI specifications, enforce OAuth2/OIDC security, and implement rate limiting and analytics in Java Spring Boot.', 
'Sofrecom Maroc', 'Casablanca', 'FULL_TIME', 'SENIOR', 
'API Gateway, Java, Spring Boot, REST APIs, OAuth2, Docker, Postman, Microservices', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'sofrecom@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'QA Automation Lead (Cypress & Playwright)', 
'Lead the automated web testing strategy across multi-country telecom digital products. You will implement fast, reliable test suites using Cypress and Playwright, integrate results into continuous delivery pipelines, and guide QA best practices.', 
'Sofrecom Maroc', 'Rabat Technopolis', 'FULL_TIME', 'LEAD', 
'Cypress, Playwright, TypeScript, JavaScript, CI/CD, Git, Test Automation, JIRA', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'sofrecom@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- COMPANY 11: Thales Morocco (5 jobs)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Embedded Systems & Firmware Engineer (C / C++)', 
'Thales Competence Center in Rabat Technopolis is seeking an Embedded Systems Engineer to develop secure firmware for defense, aerospace, and identity products. You will write low-level C and C++ code, interface with microcontrollers, and perform hardware-in-the-loop debugging.', 
'Thales Morocco', 'Rabat Technopolis', 'FULL_TIME', 'SENIOR', 
'C, C++, RTOS, Linux, Embedded Systems, Git, Microcontrollers, Hardware Debugging', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'thales@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Digital Identity & Cryptography Security Engineer', 
'Design secure biometric identity documents (e-Passports, national ID cards) and public key infrastructure (PKI) solutions. You will implement cryptographic algorithms, optimize secure chip memory usage, and ensure compliance with international ICAO standards.', 
'Thales Morocco', 'Rabat Technopolis', 'FULL_TIME', 'SENIOR', 
'Cryptography, PKI, Java, C++, Smart Cards, Biometrics, Linux, Security', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'thales@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Cyber Defense Analyst & Threat Hunter', 
'Protect critical governmental and enterprise infrastructure against state-sponsored and cybercrime threats. You will analyze suspicious binaries, investigate intrusion attempts, and develop automated detection signatures for security incident teams.', 
'Thales Morocco', 'Casablanca / Rabat', 'FULL_TIME', 'MID_LEVEL', 
'SIEM, Threat Intelligence, Linux, Python, Wireshark, Network Security, Malware Analysis', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'thales@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Software Quality & Safety Verification Engineer', 
'Verify safety-critical software systems according to rigorous DO-178C and CMMI Level 3 quality standards. You will execute static code analysis, code coverage reviews, and design automated verification tests in Python and C++.', 
'Thales Morocco', 'Rabat Technopolis', 'FULL_TIME', 'MID_LEVEL', 
'Python, C++, Testing, CI/CD, Git, Linux, Static Analysis, Quality Assurance', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'thales@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'DevSecOps & Secure Linux Platform Engineer', 
'Deploy hardened Linux operating systems and secure container runtimes for aerospace and defense programs. You will implement automated security hardening (CIS Benchmarks), configure Docker container isolation, and automate builds with GitLab CI.', 
'Thales Morocco', 'Rabat Technopolis', 'FULL_TIME', 'MID_LEVEL', 
'Linux, DevSecOps, Docker, Ansible, Bash, Git, Security Hardening, CI/CD', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'thales@hiresmart.ma';

-- End of Migration V5
