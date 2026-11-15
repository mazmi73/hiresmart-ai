# HireSmart AI — Quality Assurance & Test Report
**Final-Year Engineering Project (PFE) — Software Development & Information Technology**

---

## 1. Test Strategy Overview

The testing methodology combines three verification tiers:
1. **Unit & Logic Testing**: Core deterministic algorithms (Apache PDFBox extraction, regex skill dictionary matching, alias normalization, overlap percentage calculation).
2. **Service & Mockito Testing**: Authentication, registration, authorization, duplicate application guardrails.
3. **End-to-End Containerized System Verification**: Full multi-container Docker validation verifying Angular-to-Spring-Boot API communication, Spring-Boot-to-PostgreSQL persistence, and volume integrity.

---

## 2. Test Execution Summary

| Test Category | Total Tests | Passed | Failed | Success Rate |
| :--- | :---: | :---: | :---: | :---: |
| **Skill Matching & AI Engine** | 4 | 4 | 0 | **100%** |
| **Apache PDFBox Text Extraction** | 1 | 1 | 0 | **100%** |
| **Authentication & JWT Security** | 3 | 3 | 0 | **100%** |
| **Application & Pipeline Guardrails**| 2 | 2 | 0 | **100%** |
| **End-to-End Container Verification**| 5 | 5 | 0 | **100%** |
| **Total** | **15** | **15** | **0** | **100%** |

---

## 3. Detailed Test Cases Matrix

### 3.1 Skill Matching & AI Analysis Suite (`SkillMatchingServiceTest`)

#### TC-01: Exact 60% Skill Overlap Scenario (Mandatory Acceptance Test)
- **Objective**: Verify that comparing a job requiring 5 skills against a candidate CV documenting 3 of those skills yields precisely 60.0% match overlap with exact matched and missing categorizations.
- **Inputs**:
  - Required Skills: `"Java, Spring Boot, Angular, Docker, PostgreSQL"` (5 skills)
  - CV Text: Contains `"Java, Spring Boot, Angular, Git"`
- **Expected Results**:
  - `percentage == 60.0%`
  - `matchedSkills == ["Java", "Spring Boot", "Angular"]`
  - `missingSkills == ["Docker", "PostgreSQL"]`
  - Explanation contains `"3 of 5 (60.0% overlap)"`
- **Result**: **PASS**

#### TC-02: 100% Full Competency Match
- **Objective**: Verify 100% match when all required skills are present.
- **Inputs**:
  - Required Skills: `"Java, Spring Boot, Docker"`
  - CV Text: `"Expert in Java, Spring Boot, Docker, and Kubernetes"`
- **Expected Results**: `percentage == 100.0%`, `missingSkills.isEmpty() == true`.
- **Result**: **PASS**

#### TC-03: Zero Required Skills Division-by-Zero Safety
- **Objective**: Ensure job offers without configured required skills do not trigger arithmetic division by zero.
- **Inputs**: `requiredSkills == ""`
- **Expected Results**: `percentage == 0.0%`, `valid == false`, explanation states `"Analysis unavailable: This job offer has no required skills configured"`.
- **Result**: **PASS**

#### TC-04: Alias Normalization & Case Insensitivity
- **Objective**: Ensure colloquial skill names (`postgres`, `springboot`, `TS`) map cleanly to canonical dictionary terms (`PostgreSQL`, `Spring Boot`, `TypeScript`).
- **Inputs**:
  - Required Skills: `"PostgreSQL, Spring Boot, TypeScript"`
  - CV Text: `"Experienced with postgres database, springboot frameworks, and TS frontend logic."`
- **Expected Results**: `percentage == 100.0%`, all 3 skills recognized.
- **Result**: **PASS**

---

### 3.2 Apache PDFBox Text Extraction Suite (`PdfExtractionServiceTest`)

#### TC-05: Programmatic PDF Text Parsing
- **Objective**: Generate a real PDF document using `org.apache.pdfbox.pdmodel.PDDocument` and verify text extraction.
- **Inputs**: Synthetic PDF containing `"ALEX VANCE - SOFTWARE ENGINEER"`, `"Core Competencies: Java, Spring Boot, Angular, Git"`.
- **Expected Results**: Extracted string non-null, contains exact substrings `"Java"`, `"Spring Boot"`, `"Angular"`.
- **Result**: **PASS**

---

### 3.3 Security & Authentication Suite (`AuthServiceTest`)

#### TC-06: Candidate Registration
- **Objective**: Register new candidate, hash password with BCrypt, generate JWT, create `CandidateProfile`.
- **Result**: **PASS**

#### TC-07: Duplicate Registration Guardrail
- **Objective**: Verify that attempting to register an existing email raises `DuplicateResourceException` (HTTP 409).
- **Result**: **PASS**

#### TC-08: Recruiter Authentication & JWT Issuance
- **Objective**: Authenticate recruiter credentials and verify signed token containing role `RECRUITER`.
- **Result**: **PASS**

---

### 3.4 Application Pipeline Guardrails Suite (`ApplicationServiceTest`)

#### TC-09: Duplicate Application Prevention
- **Objective**: Prevent candidate from applying twice to the same job posting.
- **Expected Result**: Throws `DuplicateResourceException`.
- **Result**: **PASS**

#### TC-10: Application Status Lifecycle
- **Objective**: Recruiter updates status from `SUBMITTED` to `INTERVIEW`.
- **Expected Result**: Application updated in database with timestamp.
- **Result**: **PASS**

---

### 3.5 End-to-End Container Verification

| Scenario | Component | Verified Behavior | Status |
| :--- | :--- | :--- | :---: |
| **C-01** | Database Service | PostgreSQL initializes with Flyway schema & seed accounts | **PASS** |
| **C-02** | Backend Health | `/api/health` returns HTTP 200 `status: UP` | **PASS** |
| **C-03** | Frontend Nginx | Angular SPA served at `http://localhost:4200` with SPA fallback | **PASS** |
| **C-04** | API Reverse Proxy| Nginx proxies `/api/*` to `backend:8080/api/*` seamlessly | **PASS** |
| **C-05** | CV Volume Persistence| Candidate uploads survive container restarts | **PASS** |
