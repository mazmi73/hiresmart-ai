# HireSmart AI — Functional & Technical Project Specification
**Final-Year Engineering Project (PFE) — Software Development & Information Technology**

---

## 1. Project Context & Problem Statement

Modern talent acquisition pipelines face severe operational bottlenecks:
1. **Resume Overload**: Recruiters spend excessive hours manually parsing heterogeneous CV formats (primarily PDF) to cross-reference technical skills against job descriptions.
2. **Opaque Automated Filtering**: Many proprietary ATS (Applicant Tracking Systems) employ non-transparent, black-box AI algorithms that automatically disqualify candidates without explainability, introducing bias and frustration.
3. **Infrastructure Complexity**: Commercial HR solutions typically rely on distributed microservices (Kafka, Redis, Elasticsearch, Kubernetes) that introduce substantial infrastructure overhead and failure modes unsuitable for focused engineering teams or private deployments.

**HireSmart AI** addresses these challenges by offering an intelligent, fully containerized recruitment management platform built on a robust modular monolith architecture. The system features deterministic and explainable CV skills analysis powered by Apache PDFBox, with an optional enhancement layer via Google Gemini.

---

## 2. Objectives

### 2.1 Primary Objectives
- **End-to-End Recruitment Workflow**: Facilitate job publication, candidate search, profile management, and application lifecycle tracking.
- **Explainable CV Skills Overlap**: Automatically extract text from candidate PDF CVs and compute exact overlap percentages against mandatory position requirements.
- **Decision Support (Not Replacement)**: Explicitly assist hiring teams without making autonomous acceptance/rejection decisions or ranking candidates on demographic factors.
- **Single-Command Dockerization**: Deploy the full three-tier application (Angular SPA, Spring Boot API, PostgreSQL database) with persistent volumes using `docker compose up --build -d`.

### 2.2 Secondary Objectives
- Enable optional Google Gemini 1.5 Flash enrichment with strict timeouts and automatic local fallback.
- Enforce strict role-based access control (RBAC) preventing cross-tenant and unauthorized data retrieval.
- Provide Swagger/OpenAPI interactive documentation for all endpoints.

---

## 3. Actors & System Roles

| Actor | Description | Key Permissions |
| :--- | :--- | :--- |
| **Candidate** | Individual seeking engineering opportunities | Registers account, creates candidate profile, uploads and updates PDF CVs, browses and searches active jobs, submits applications, tracks application status, inspects skills match explanations. |
| **Recruiter** | Talent acquisition professional representing hiring organizations | Registers account, manages company profile, creates/edits/closes/reopens job offers, reviews applicant pipeline, securely downloads PDF resumes, triggers AI CV analysis, transitions application status. |
| **AI Matching Engine** | Internal backend service component | Parses PDF files with Apache PDFBox, normalizes aliases, computes percentage overlap, persists audit records. |

---

## 4. Functional Requirements

### 4.1 Authentication & Profile Management
- **FR-01 (Registration)**: Allow candidates and recruiters to register with unique email addresses, BCrypt-hashed passwords, and role selection.
- **FR-02 (Authentication)**: Validate credentials and return signed JSON Web Tokens (JWT) containing userId and role claims.
- **FR-03 (Candidate Profile)**: Support candidate profile attributes (first name, last name, phone, title, education, experience, self-reported skills).
- **FR-04 (Recruiter Profile)**: Support company metadata (company name, description, website, headquarters location).

### 4.2 Job Management
- **FR-05 (Job CRUD)**: Recruiters can create, edit, close (inactivate), reopen, and delete job postings.
- **FR-06 (Job Discovery)**: Public and authenticated users can search active jobs by keywords (title/description/company), location, employment type (`FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`), and experience level (`JUNIOR`, `MID_LEVEL`, `SENIOR`, `LEAD`) with pagination.

### 4.3 Application Lifecycle
- **FR-07 (Application Submission)**: Candidates can submit applications either using an existing uploaded CV or attaching a new PDF document with an optional cover letter.
- **FR-08 (Duplicate Prevention)**: Candidates cannot apply more than once to the same job posting (enforced by database unique constraint `uk_job_candidate` and service layer).
- **FR-09 (Status Transitions)**: Recruiters can update application statuses across standard stages: `SUBMITTED` &rarr; `UNDER_REVIEW` &rarr; `INTERVIEW` &rarr; `ACCEPTED` / `REJECTED`.
- **FR-10 (Secure File Access)**: Uploaded CV documents are stored outside the public web root and accessible only by authorized candidates (their own) or recruiters (applicants to their jobs).

### 4.4 AI-Assisted CV Analysis
- **FR-11 (PDF Text Extraction)**: Extract textual content from candidate PDF resumes using Apache PDFBox 3.x.
- **FR-12 (Skills Matching & Scoring)**: Match detected skills against required competencies, computing:
  $$\text{Match Percentage} = \frac{\text{Matched Required Skills}}{\text{Total Required Skills}} \times 100$$
- **FR-13 (Explainable Feedback)**: Display a breakdown showing matched competencies, missing requirements, all detected CV keywords, and an ethical AI disclaimer.
- **FR-14 (Optional Gemini Integration)**: When `GEMINI_API_KEY` is present, query Google Gemini for qualitative feedback with automatic fallback to local deterministic analysis.

---

## 5. Non-Functional Requirements

- **NFR-01 (Security)**: Passwords hashed with BCrypt (cost factor 10); REST endpoints protected with stateless JWT authentication; CORS configured; inputs validated via Jakarta Bean Validation.
- **NFR-02 (Performance)**: PDF text extraction completes in < 500ms for standard single/multi-page resumes. Search queries indexed via PostgreSQL B-tree indexes.
- **NFR-03 (Portability)**: Runs on any operating system equipped with Docker Desktop or Docker Engine + Docker Compose. Host requires zero local installations of Java, Node.js, or PostgreSQL.
- **NFR-04 (Persistence)**: Named Docker volumes ensure database records (`postgres_data`) and uploaded CVs (`cv_uploads`) persist across container teardowns.
- **NFR-05 (Maintainability)**: Clear layered modular monolith design (Controller &rarr; Service &rarr; Repository).

---

## 6. Business Rules Matrix

| Rule ID | Rule Name | Description |
| :--- | :--- | :--- |
| **BR-01** | Role Segregation | Candidates cannot post/edit jobs or modify recruiter applications. Recruiters cannot apply to jobs. |
| **BR-02** | Unique Application | A candidate may only have one active application per job offer. |
| **BR-03** | Zero Requirements Safe Division | If a job specifies zero required skills, match percentage defaults to 0.0% with an explicit notice, avoiding division-by-zero errors. |
| **BR-04** | Active Job Enforcement | Candidates cannot submit applications to jobs with status `CLOSED`. |
| **BR-05** | CV File Integrity | Only files with MIME type `application/pdf` and maximum size of 10MB are accepted. |

---

## 7. MVP Scope & Limitations

1. **Text-based PDFs**: The current release focuses on digital text-based PDFs. Optical Character Recognition (OCR) for scanned bitmaps is deferred to future releases.
2. **Advisory AI Role**: The AI analysis engine is strictly consultative. It does not automatically disqualify or accept candidates.
