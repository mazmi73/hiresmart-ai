# HireSmart AI — Intelligent Recruitment Platform

[![Docker](https://img.shields.io/badge/Docker-Dockerized-blue.svg)](https://www.docker.com/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-18-red.svg)](https://angular.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Apache PDFBox](https://img.shields.io/badge/Apache_PDFBox-3.0.3-yellow.svg)](https://pdfbox.apache.org/)

**HireSmart AI** is a complete, modern, fully functional, and Dockerized intelligent recruitment management platform designed as a Final-Year Engineering Project (PFE) in Software Development and Information Technology.

The platform connects candidates and recruiters, automates applicant tracking, parses uploaded PDF CVs using **Apache PDFBox**, and computes explainable, transparent skill overlaps against job requirements without black-box rejections.

---

## 1. Mandatory Technology Stack

| Tier | Technologies |
| :--- | :--- |
| **Frontend** | Angular 18, TypeScript, Tailwind CSS, Angular Router, Reactive Forms, HttpClient, Nginx |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Security, Spring Data JPA, Hibernate, JWT, Maven, Swagger/OpenAPI |
| **Database** | PostgreSQL 16, Flyway Migrations, Named Persistent Volume |
| **AI Module** | Apache PDFBox 3.x, Deterministic Skill Extraction Engine, Optional Google Gemini 1.5 Flash Fallback |
| **DevOps** | Docker, Docker Compose, Multi-stage Dockerfiles, Nginx Reverse Proxy, Container Health Checks |

---

## 2. Quick Start (Single-Command Docker Launch)

The entire application runs inside Docker. Java, Node.js, Maven, Angular CLI, and PostgreSQL do not need to be installed on the host machine.

### Start the Application
```bash
docker compose up --build -d
```

### Check Container Status
```bash
docker compose ps
```

### View Application Logs
```bash
docker compose logs -f
```

### Stop the Application
```bash
docker compose down
```

---

## 3. Application Access Points

Once started, access the services:

- **Frontend Application**: [http://localhost:4200](http://localhost:4200/)
- **Backend REST API**: [http://localhost:8080/api](http://localhost:8080/api)
- **Interactive Swagger Documentation**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Health Check Endpoint**: [http://localhost:8080/api/health](http://localhost:8080/api/health)

---

## 4. Pre-Configured Demonstration Accounts

| Role | Email | Password | Display Name |
| :--- | :--- | :--- | :--- |
| **Recruiter** | `recruiter@hiresmart.ai` | `Recruiter123!` | TechNova Innovations |
| **Candidate** | `candidate@hiresmart.ai` | `Candidate123!` | Alex Vance |
| **Candidate (Secondary)** | `john.doe@example.com` | `Candidate123!` | John Doe |

*(The login screen features one-click quick-fill buttons for demonstration convenience).*

---

## 5. End-to-End PFE Demonstration Scenario

1. **Log in as Recruiter** (`recruiter@hiresmart.ai`).
2. Create a job requiring **`Java, Spring Boot, Angular, Docker, PostgreSQL`** *(5 mandatory skills)*.
3. **Log in as Candidate** (`candidate@hiresmart.ai`).
4. Upload the provided test PDF CV at `test-assets/synthetic_alex_vance_cv.pdf` containing **`Java, Spring Boot, Angular, Git`**.
5. Apply to the created job offer.
6. **Log back in as Recruiter**.
7. Open the application and click **Run AI Analysis**.
8. **Verify the 60.0% overlap result**:
   - **Matched**: `Java`, `Spring Boot`, `Angular` (3 skills)
   - **Missing**: `Docker`, `PostgreSQL` (2 skills)
   - **Score**: $3 / 5 \times 100 = 60.0\%$
9. Change the application status to **`INTERVIEW`**.
10. **Log back in as Candidate** and verify the updated status and transparent skills analysis explanation.

---

## 6. Project Documentation & Architecture

Comprehensive PFE documentation and UML diagrams:

- [Project Specification](file:///c:/Users/J_jolam/Downloads/HireSmart%20AI/docs/PROJECT_SPECIFICATION.md)
- [Software Architecture & UML Diagrams](file:///c:/Users/J_jolam/Downloads/HireSmart%20AI/docs/SOFTWARE_ARCHITECTURE.md)
- [Database Design & ER Diagram](file:///c:/Users/J_jolam/Downloads/HireSmart%20AI/docs/DATABASE_DESIGN.md)
- [REST API Documentation](file:///c:/Users/J_jolam/Downloads/HireSmart%20AI/docs/API_DOCUMENTATION.md)
- [Quality Assurance & Test Report](file:///c:/Users/J_jolam/Downloads/HireSmart%20AI/docs/TEST_REPORT.md)
- [PFE Defense Demonstration Script](file:///c:/Users/J_jolam/Downloads/HireSmart%20AI/docs/DEMO_GUIDE.md)
