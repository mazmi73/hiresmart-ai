-- HireSmart AI Database Schema Migration V6
-- Diverse Moroccan Business Domains: Sales, Banking, Retail, Manufacturing, Insurance, Customer Service, Consulting, Marketing, Project Management
-- Standard password for all recruiter accounts: Recruiter123!
-- BCrypt Hash: $2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u

-- ============================================================================
-- 1. PROVISION NEW RECRUITER ACCOUNTS FOR NON-ENGINEERING & DIVERSE SECTORS
-- ============================================================================

INSERT INTO users (email, password, role, created_at, updated_at)
VALUES 
-- Motor Vehicle Manufacturing
('renault@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Retail & Supermarkets
('marjane@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Insurance & Risk
('wafaassurance@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Customer Service, BPO & Multilingual Outsourcing
('webhelp@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Business Consulting & Audit
('kpmg@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Luxury Retail, Sales & Marketing
('aksal@hiresmart.ma', '$2a$10$R5D4X3cIGyW75FE2jzg8x.vselSspYUwWrH3DnPwZ.FMO4Jte0I2u', 'RECRUITER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password, updated_at = CURRENT_TIMESTAMP;


-- ============================================================================
-- 2. CREATE RECRUITER PROFILES FOR NEW COMPANIES
-- ============================================================================

-- Renault Group Morocco
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'Renault Group Morocco', 'Leader of the Moroccan automotive industry with major state-of-the-art vehicle assembly plants in Tangier (Tangier Automotive City) and Casablanca (SOMACA), producing vehicles for over 70 global export destinations.', 'https://www.renault.ma', 'Tangier & Casablanca', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'renault@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- Marjane Group
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'Marjane Group', 'Pioneer and Moroccan retail market leader operating over 130 hypermarkets, supermarkets, and electronic stores across 30 cities with modern omni-channel e-commerce logistics.', 'https://www.marjane.ma', 'Casablanca (Nation-wide)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'marjane@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- Wafa Assurance
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'Wafa Assurance', 'Leading insurance company in Morocco and Africa, providing life, health, auto, property, and corporate risk protection solutions to millions of individual and corporate clients.', 'https://www.wafaassurance.ma', 'Casablanca', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'wafaassurance@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- Concentrix + Webhelp Morocco
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'Concentrix + Webhelp Morocco', 'Global customer experience and BPO solutions leader employing over 12,000 specialists across Rabat, Casablanca, Fez, and Agadir, delivering multilingual support and sales development in English, French, and Spanish.', 'https://www.webhelp.com', 'Rabat, Casablanca & Fez', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'webhelp@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- KPMG Morocco
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'KPMG Morocco', 'Big Four global professional services firm delivering multidisciplinary audit, tax advisory, management consulting, and financial transaction services to Moroccan and multinational corporations.', 'https://home.kpmg/ma', 'Casablanca', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'kpmg@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;

-- Aksal Group
INSERT INTO recruiter_profiles (user_id, company_name, company_description, website, location, created_at, updated_at)
SELECT id, 'Aksal Group', 'Moroccan luxury, retail, and commercial real estate giant managing world-renowned fashion, beauty, and department store brands across Morocco Mall and luxury shopping avenues.', 'https://www.groupeaksal.com', 'Casablanca & Marrakech', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users WHERE email = 'aksal@hiresmart.ma'
ON CONFLICT (user_id) DO UPDATE 
SET company_name = EXCLUDED.company_name, company_description = EXCLUDED.company_description, website = EXCLUDED.website, location = EXCLUDED.location;


-- ============================================================================
-- 3. INSERT JOB OFFERS ACROSS DIVERSE NON-ENGINEERING DOMAINS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- DOMAIN: MOTOR VEHICLE MANUFACTURING (Renault Group Morocco)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Vehicle Assembly Production Supervisor / Job Captain', 
'Renault Tangier Plant is seeking an experienced Job Captain / Assembly Supervisor to lead a production team on the vehicle assembly line. You will supervise shop-floor operators, enforce Lean manufacturing standards (5S, Kaizen), track hourly throughput targets, and guarantee vehicle assembly quality compliance.', 
'Renault Group Morocco', 'Tangier (Automotive City)', 'FULL_TIME', 'MID_LEVEL', 
'Lean Manufacturing, Production Management, Team Leadership, 5S, Kaizen, Quality Control, Automotive Assembly', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'renault@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Automotive Supply Chain & Logistics Coordinator', 
'Coordinate inbound supplier logistics and parts delivery for the Renault SOMACA Casablanca plant. You will analyze supplier delivery schedules, manage inventory safety buffers in SAP ERP, optimize container turnaround, and eliminate production line shortage risks.', 
'Renault Group Morocco', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Supply Chain Management, SAP ERP, Logistics, Inventory Control, Negotiation, Excel, Automotive Industry', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'renault@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Industrial Operations Project Manager', 
'Manage new vehicle tooling and production line ramp-up projects at Renault Tangier. You will establish project milestones, track tooling budget investments, coordinate across engineering, maintenance, and production departments, and present operational KPI reports to plant executive leadership.', 
'Renault Group Morocco', 'Tangier', 'FULL_TIME', 'LEAD', 
'Project Management, Industrial Engineering, APQP, Budget Management, Risk Management, Leadership, Automotive', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'renault@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Manufacturing Quality Control Specialist', 
'Ensure adherence to rigorous ISO/TS 16949 automotive quality standards. You will inspect stamped body panels and paint finishes, conduct root-cause defect analyses with 8D methodologies, and train assembly operators on quality self-checks.', 
'Renault Group Morocco', 'Casablanca', 'FULL_TIME', 'SENIOR', 
'Quality Assurance, 8D, FMEA, ISO 16949, Statistical Process Control, Continuous Improvement, Automotive', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'renault@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- DOMAIN: RETAIL & SALES (Marjane Group)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Retail Store Operations Manager', 
'Marjane Group is recruiting an ambitious Store Operations Manager to steer store commercial profitability, inventory merchandising, and customer satisfaction in Casablanca. You will lead 60+ store staff, optimize departmental sales margins, and maintain exceptional hygiene and safety standards.', 
'Marjane Group', 'Casablanca', 'FULL_TIME', 'SENIOR', 
'Store Management, Retail Operations, Team Leadership, Sales Margin Optimization, Merchandising, Customer Service', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'marjane@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Category Merchandiser & Buyer (Retail)', 
'Manage product assortments and supplier negotiations for fresh and FMCG categories across Marjane hypermarkets. You will analyze sales velocity data, negotiate promotional campaigns with Moroccan food suppliers, and optimize shelf share allocation.', 
'Marjane Group', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Merchandising, Supplier Negotiation, Category Management, Sales Forecasting, Excel, Retail Buying', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'marjane@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'B2C Sales Associate & Customer Service Representative', 
'Join the front line of customer engagement at Marjane Rabat. You will advise shoppers on electronics and home appliances, maintain clean shelf displays, handle customer loyalty program registrations, and resolve product inquiries with a warm, courteous attitude.', 
'Marjane Group', 'Rabat', 'FULL_TIME', 'JUNIOR', 
'Customer Service, B2C Sales, Communication Skills, Product Demonstration, Cash Handling, Problem Solving', 
'ACTIVE', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'marjane@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Distribution Center Warehouse Operations Supervisor', 
'Supervise daily inbound goods reception, order pallet picking, and outbound truck dispatches at Marjane central distribution warehouse. You will organize shifts, enforce safety rules, and ensure delivery on-time-in-full (OTIF) rates.', 
'Marjane Group', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Warehouse Management, Logistics Operations, WMS Software, Team Supervision, Inventory Tracking', 
'ACTIVE', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'marjane@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- DOMAIN: INSURANCE & RISK (Wafa Assurance)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Insurance Underwriter & Risk Assessment Specialist', 
'Evaluate corporate property, casualty, and commercial liability risks for Moroccan enterprises. You will analyze historical loss data, calculate appropriate insurance premium pricing, draft policy clauses, and liaise with independent insurance brokers.', 
'Wafa Assurance', 'Casablanca', 'FULL_TIME', 'SENIOR', 
'Insurance Underwriting, Risk Assessment, Property & Casualty, Contract Law, Financial Analysis, Negotiation', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'wafaassurance@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Corporate Insurance Sales Executive (B2B Sales)', 
'Grow Wafa Assurance B2B corporate client portfolio in Casablanca and Rabat. You will prospect mid-market and enterprise accounts, present tailored health and property group insurance proposals, and negotiate multi-year service contracts with corporate HR and CFOs.', 
'Wafa Assurance', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'B2B Sales, Business Development, Corporate Insurance, Contract Negotiation, CRM, Client Relationship Management', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'wafaassurance@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Customer Claims Settlement & Compensation Specialist', 
'Manage automobile and health insurance claims files from initial declaration to indemnity settlement. You will review accident reports, assess expert surveyor evaluations, communicate empathetic claim updates to policyholders, and authorize insurance payouts.', 
'Wafa Assurance', 'Rabat', 'FULL_TIME', 'MID_LEVEL', 
'Claims Management, Customer Service, Legal Analysis, Dispute Resolution, Communication, Empathy', 
'ACTIVE', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'wafaassurance@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Actuarial & Statistical Data Analyst', 
'Model mortality tables, loss reserve requirements, and solvency ratios under Solvency II frameworks. You will leverage statistical modeling in R/Python and advanced Excel to help actuaries forecast claims frequency and determine optimal capital reserves.', 
'Wafa Assurance', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Actuarial Science, Data Analysis, Statistical Modeling, Python, R, Excel, Financial Risk, Solvency II', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'wafaassurance@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- DOMAIN: CUSTOMER SERVICE, BPO & MULTILINGUAL SUPPORT (Webhelp / Concentrix)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Bilingual English Specialist & Customer Success Representative', 
'Provide premium omnichannel customer support (phone, email, chat) to UK and US consumer tech accounts. You will diagnose customer issues, provide clear resolutions with native-level English fluency, maintain top CSAT scores, and represent leading international brands.', 
'Concentrix + Webhelp Morocco', 'Rabat (Agdal)', 'FULL_TIME', 'JUNIOR', 
'English Specialist, English Fluency, Customer Service, Written Communication, Problem Solving, Empathy, Active Listening', 
'ACTIVE', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'webhelp@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Sales Development Representative (SDR - Fluent English)', 
'Generate qualified B2B sales leads for international SaaS software clients. You will conduct cold outreach via phone, email, and LinkedIn, pitch value propositions to decision-makers in North America and Europe, and book product discovery meetings for Account Executives.', 
'Concentrix + Webhelp Morocco', 'Casablanca Nearshore', 'FULL_TIME', 'MID_LEVEL', 
'Sales Development Representative, B2B Sales, Cold Calling, Lead Generation, English Fluency, CRM, Salesforce, Outreach', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'webhelp@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Customer Support Team Lead / Operations Supervisor', 
'Supervise a team of 15 bilingual customer advisors. You will monitor live calls, conduct weekly quality coaching sessions, analyze First Call Resolution (FCR) metrics, manage agent schedules, and report operational SLAs to international corporate clients.', 
'Concentrix + Webhelp Morocco', 'Fez Shore', 'FULL_TIME', 'SENIOR', 
'Team Leadership, Customer Service Management, Operations Supervision, KPI Tracking, Coaching, Conflict Resolution', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'webhelp@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'English Language Trainer & Quality Evaluator', 
'Design and deliver English language onboarding modules and voice/accent coaching for new customer advisors. You will evaluate call recordings against grammatical accuracy, tone, and empathy benchmarks, providing structured feedback to elevate team communication quality.', 
'Concentrix + Webhelp Morocco', 'Rabat', 'FULL_TIME', 'MID_LEVEL', 
'English Specialist, Corporate Training, Accent Coaching, Quality Assurance, Adult Learning, Curriculum Design', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'webhelp@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- DOMAIN: BUSINESS CONSULTING & FINANCIAL ADVISORY (KPMG Morocco)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Senior Business Management Consultant', 
'Advise Moroccan public institutions and private enterprises on strategic transformation, organizational redesign, and operational efficiency. You will conduct market benchmark studies, interview executive leadership, design target operating models, and deliver board-level presentations.', 
'KPMG Morocco', 'Casablanca', 'FULL_TIME', 'SENIOR', 
'Management Consulting, Business Strategy, Change Management, Financial Modeling, Executive Presentation, Project Management', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'kpmg@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Financial Advisory & M&A Transaction Senior Analyst', 
'Support mergers, acquisitions, and corporate valuations across North and West Africa. You will build discounted cash flow (DCF) valuation models, perform buy-side financial due diligence, and draft investor confidential information memorandums (CIM).', 
'KPMG Morocco', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Financial Analysis, M&A Advisory, Due Diligence, DCF Valuation, Financial Modeling, Accounting, Corporate Finance', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'kpmg@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Enterprise Project Manager & Change Consultant', 
'Lead large-scale enterprise transformation projects for corporate clients in Morocco. You will manage cross-functional stakeholder alignment, establish project PMO governance, define risk mitigation strategies, and track milestone budget deliverables.', 
'KPMG Morocco', 'Casablanca (Hybrid)', 'FULL_TIME', 'LEAD', 
'Project Manager, PMO Governance, Change Management, Stakeholder Management, Agile, Leadership, Consulting', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'kpmg@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Junior Tax & Financial Consultant (Graduate Program)', 
'Assist senior tax partners in researching Moroccan tax code compliance, corporate tax return preparations, and transfer pricing documentation. You will prepare client compliance reports and analyze local VAT and customs implications.', 
'KPMG Morocco', 'Casablanca', 'FULL_TIME', 'JUNIOR', 
'Tax Compliance, Accounting, Financial Analysis, Moroccan Tax Law, Excel, Legal Research', 
'ACTIVE', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'kpmg@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- DOMAIN: LUXURY RETAIL, SALES & MARKETING (Aksal Group)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Business Development Manager (Retail & Luxury Brands)', 
'Drive commercial brand expansion and franchise partnerships for Aksal Group portfolio of international luxury and fashion brands in Morocco. You will identify prime retail locations, negotiate lease agreements, and forecast brand turnover and return on investment.', 
'Aksal Group', 'Casablanca', 'FULL_TIME', 'SENIOR', 
'Business Development Manager, Business Development, Retail Strategy, Franchise Negotiation, Luxury Brands, Market Analysis', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'aksal@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Brand Marketing & Digital Campaign Specialist', 
'Plan and execute creative digital marketing, social media influencer activations, and retail store launch campaigns. You will analyze customer engagement metrics, manage promotional budgets, and collaborate with creative agencies to elevate brand prestige.', 
'Aksal Group', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Marketing Strategy, Brand Marketing, Digital Campaigns, Social Media Marketing, Content Creation, Analytics', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'aksal@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Senior B2B Salesperson & Key Account Manager', 
'Cultivate corporate gift cards, B2B wholesale orders, and executive VIP accounts across Aksal retail network. You will negotiate high-volume commercial contracts, organize VIP private shopping events, and consistently exceed annual sales quotas.', 
'Aksal Group', 'Casablanca', 'FULL_TIME', 'SENIOR', 
'Salesperson, B2B Sales, Key Account Management, Negotiation, Client Relationship Management, Quota Attainment', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'aksal@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Luxury Retail Sales Specialist & Customer Host', 
'Welcome and advise high-net-worth clientele within flagship luxury boutiques at Morocco Mall. You will deliver personalized styling advice, manage high-value product sales transactions, and foster long-term customer loyalty through bespoke clienteling.', 
'Aksal Group', 'Marrakech', 'FULL_TIME', 'JUNIOR', 
'Luxury Sales, Customer Service, Clienteling, Personal Styling, Retail, Communication Skills', 
'ACTIVE', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'aksal@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- DOMAIN: BANKING & FINANCIAL SERVICES (Attijariwafa Bank - Additional 3 Non-Engineering Roles)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Branch Customer Relationship Manager (Chargé de Clientèle)', 
'Manage a portfolio of personal and professional banking clients in Casablanca. You will advise clients on consumer credit, mortgage financing, savings products, and bancassurance, while meeting quarterly branch sales objectives.', 
'Attijariwafa Bank', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Banking Sales, Customer Relationship Management, Consumer Credit, Financial Advisory, Negotiation, Bancassurance', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'attijariwafa@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Commercial Banking Salesperson (PME / Mid-Market)', 
'Prospect and manage mid-sized Moroccan enterprises (PME). You will structure working capital credit lines, evaluate balance sheet debt capacity, negotiate trade financing facilities, and grow non-interest bank revenues.', 
'Attijariwafa Bank', 'Rabat', 'FULL_TIME', 'SENIOR', 
'Salesperson, Corporate Banking, Credit Risk Analysis, B2B Sales, Commercial Lending, Financial Statement Analysis', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'attijariwafa@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Senior Financial Risk & Regulatory Compliance Analyst', 
'Monitor bank-wide counterparty risk exposures and ensure adherence to Bank Al-Maghrib Basel III capital adequacy guidelines. You will review credit dossiers, stress-test credit portfolios, and prepare board risk committee dossiers.', 
'Attijariwafa Bank', 'Casablanca Finance City', 'FULL_TIME', 'SENIOR', 
'Credit Risk, Financial Analysis, Basel III, Banking Regulations, Compliance, Risk Management, Stress Testing', 
'ACTIVE', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'attijariwafa@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- DOMAIN: TELECOM SALES & CUSTOMER SUPPORT (Maroc Telecom - Additional 3 Non-Engineering Roles)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'B2B Telecom Solutions Sales Specialist', 
'Prospect and manage enterprise telecom solutions across Casablanca corporate accounts. You will sell enterprise fiber connectivity, unified communications, and cloud PBX services, negotiating multi-year high-value telecom service agreements.', 
'Maroc Telecom', 'Casablanca', 'FULL_TIME', 'MID_LEVEL', 
'Business Development Specialist, B2B Sales, Telecom Sales, Solution Selling, Contract Negotiation, CRM', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'maroctelecom@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Customer Retention & VIP Client Support Specialist', 
'Retain high-value residential and business subscribers by resolving complex billing disputes, proposing competitive upgrade packages, and turning around dissatisfied clients with high empathy and negotiation tact.', 
'Maroc Telecom', 'Rabat', 'FULL_TIME', 'JUNIOR', 
'Customer Service, Customer Retention, Problem Solving, Communication, Conflict Resolution, Empathy', 
'ACTIVE', 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'maroctelecom@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Strategic Marketing & Pricing Analyst', 
'Analyze consumer mobile and fiber optic market trends, competitor tariff packages, and consumer price elasticity in Morocco. You will build dynamic pricing models, recommend seasonal promotions, and assess churn reduction campaigns.', 
'Maroc Telecom', 'Rabat', 'FULL_TIME', 'SENIOR', 
'Marketing Strategy, Pricing Strategy, Market Research, Financial Modeling, Data Analysis, Excel, Telecom Marketing', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'maroctelecom@hiresmart.ma';


-- ----------------------------------------------------------------------------
-- DOMAIN: BUSINESS DEVELOPMENT & CONSULTING (OCP Group & CGI)
-- ----------------------------------------------------------------------------
INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Global Marketing & Agricultural Business Development Specialist', 
'Develop pan-African agricultural partnership opportunities for customized fertilizer and soil nutrient products. You will liaise with government agricultural ministries, design farmer education campaigns, and open new distribution channels in West and East Africa.', 
'OCP Group', 'Casablanca', 'FULL_TIME', 'SENIOR', 
'Business Development Specialist, International Business, Agriculture Marketing, Partnership Development, Negotiation, Strategy', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'ocp@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Human Resources & Talent Acquisition Partner', 
'Lead talent acquisition, university campus relations, and executive hiring for OCP corporate programs. You will screen senior leadership candidates, facilitate recruitment interviews, and champion employee value proposition initiatives.', 
'OCP Group', 'Benguerir (UM6P)', 'FULL_TIME', 'MID_LEVEL', 
'Talent Acquisition, Human Resources, Recruiting, Interviewing, Campus Relations, HR Management', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'ocp@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'IT Business Analyst & Functional Consultant', 
'Bridge business client requirements with technical development teams at CGI Casablanca. You will elicit functional specifications, map as-is and to-be business processes, draft user stories, and conduct user acceptance testing (UAT).', 
'CGI Morocco', 'Casablanca Nearshore', 'FULL_TIME', 'MID_LEVEL', 
'Business Analysis, Functional Specifications, Process Mapping, UAT Testing, Agile, JIRA, Consulting', 
'ACTIVE', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'cgi@hiresmart.ma';

INSERT INTO job_offers (recruiter_id, title, description, company_name, location, employment_type, experience_level, required_skills, status, match_threshold, created_at, updated_at)
SELECT u.id, 
'Technical Project Manager & Client Delivery Lead', 
'Capgemini Engineering is seeking a Client Delivery Project Manager to oversee international IT delivery teams in Casablanca. You will manage customer communication, track project budgets, ensure SLA milestones, and lead sprint planning sessions.', 
'Capgemini Engineering', 'Casablanca (Nearshore)', 'FULL_TIME', 'SENIOR', 
'Project Manager, Client Delivery, Agile, Scrum, Budget Management, Risk Management, Stakeholder Management', 
'ACTIVE', 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'capgemini@gmail.com';

-- End of Migration V6
