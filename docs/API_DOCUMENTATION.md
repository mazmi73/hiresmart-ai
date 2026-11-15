# HireSmart AI — REST API Documentation
**Interactive Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)  
**OpenAPI Specification JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 1. Authentication & Security Conventions

All secured endpoints expect the standard HTTP `Authorization` header with a Bearer JWT:
```http
Authorization: Bearer <jwt_token>
```
Standard Response HTTP Codes:
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Payload validation failed or bad parameters.
- `401 Unauthorized`: Invalid credentials or missing/expired token.
- `403 Forbidden`: Insufficient role permissions or accessing cross-tenant resource.
- `404 Not Found`: Target entity does not exist.
- `409 Conflict`: Unique constraint violation (e.g., duplicate application).

---

## 2. API Endpoints Reference

### 2.1 Authentication (`/api/auth`)

#### `POST /api/auth/register`
Creates a candidate or recruiter user account.
```json
// Request Body
{
  "email": "alex.vance@example.com",
  "password": "Password123!",
  "role": "CANDIDATE",
  "firstName": "Alex",
  "lastName": "Vance"
}

// Response Body (201 Created)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "id": 12,
  "email": "alex.vance@example.com",
  "role": "CANDIDATE",
  "displayName": "Alex Vance"
}
```

#### `POST /api/auth/login`
Authenticates user and returns a signed JWT token.
```json
// Request Body
{
  "email": "recruiter@hiresmart.ai",
  "password": "Recruiter123!"
}

// Response Body (200 OK)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "id": 1,
  "email": "recruiter@hiresmart.ai",
  "role": "RECRUITER",
  "displayName": "TechNova Innovations"
}
```

#### `GET /api/auth/me`
Retrieves currently authenticated user claims.

---

### 2.2 Candidate Profile & CV Management (`/api/candidates`)
*Requires Role: `CANDIDATE`*

#### `GET /api/candidates/profile`
Returns candidate's profile and active CV status.

#### `PUT /api/candidates/profile`
Updates professional background, title, education, and skills.
```json
{
  "firstName": "Alex",
  "lastName": "Vance",
  "phone": "+33 6 12 34 56 78",
  "title": "Senior Full-Stack Engineer",
  "education": "M.Sc. in Computer Science (2022)",
  "experienceSummary": "4+ years building reactive web platforms.",
  "skills": "Java, Spring Boot, Angular, TypeScript, Docker"
}
```

#### `POST /api/candidates/cv` (Multipart)
Uploads PDF resume. Extracts text via Apache PDFBox 3.x and saves file securely.
- Content-Type: `multipart/form-data`
- Body Part: `file` (PDF binary)

#### `GET /api/candidates/cv/download`
Streams candidate's own PDF document as `application/pdf`.

#### `GET /api/candidates/applications`
Lists all job applications submitted by the candidate.

---

### 2.3 Job Offers (`/api/jobs`)

#### `GET /api/jobs` (Public)
Searches active job offers with pagination and filters.
- Query Parameters: `keyword`, `location`, `employmentType`, `experienceLevel`, `page`, `size`.

#### `GET /api/jobs/{id}` (Public)
Retrieves complete details of a specific job offer.

#### `POST /api/jobs` (Recruiter only)
Publishes a new job vacancy.
```json
{
  "title": "Senior Full-Stack Engineer",
  "companyName": "TechNova Innovations",
  "location": "Paris, France (Hybrid)",
  "employmentType": "FULL_TIME",
  "experienceLevel": "SENIOR",
  "requiredSkills": "Java, Spring Boot, Angular, Docker, PostgreSQL",
  "description": "Architect next-generation AI recruitment analytics."
}
```

#### `PUT /api/jobs/{id}` (Recruiter only)
Updates existing job details.

#### `PATCH /api/jobs/{id}/status` (Recruiter only)
Updates job status to `ACTIVE` or `CLOSED`.
```json
{ "status": "CLOSED" }
```

#### `POST /api/jobs/{id}/apply` (Candidate only, Multipart)
Submits application with a newly uploaded PDF CV.
- Request Parts: `cvFile` (optional File), `coverLetter` (optional string), `cvDocumentId` (optional).

#### `POST /api/jobs/{id}/apply-saved` (Candidate only)
Submits application using candidate's previously uploaded profile CV.
- Query Parameters: `coverLetter` (optional), `cvDocumentId` (optional).

---

### 2.4 Recruiter Pipeline (`/api/recruiters`)
*Requires Role: `RECRUITER`*

#### `GET /api/recruiters/dashboard-stats`
Retrieves recruitment metrics: `totalJobs`, `activeJobs`, `totalApplications`, `applicationsUnderReview`, and `recentApplications`.

#### `GET /api/recruiters/jobs`
Lists all jobs created by the authenticated recruiter.

#### `GET /api/recruiters/jobs/{id}/applications`
Lists all candidate applications for a specific job offer.

#### `GET /api/recruiters/applications`
Lists all applications across all jobs managed by the recruiter.

---

### 2.5 Applications & AI CV Analysis (`/api/applications`)

#### `GET /api/applications/{id}`
Returns application details (accessible by job recruiter or candidate).

#### `PATCH /api/applications/{id}/status` (Recruiter only)
Updates status to `SUBMITTED`, `UNDER_REVIEW`, `INTERVIEW`, `ACCEPTED`, or `REJECTED`.
```json
{ "status": "INTERVIEW" }
```

#### `GET /api/applications/{id}/cv/download`
Downloads applicant's PDF CV document securely.

#### `POST /api/applications/{id}/analyze` (Recruiter only)
Triggers Apache PDFBox CV text extraction and skill matching against position requirements.
```json
// Response Body (200 OK)
{
  "id": 1,
  "applicationId": 10,
  "matchPercentage": 60.0,
  "matchedSkills": ["Java", "Spring Boot", "Angular"],
  "missingSkills": ["Docker", "PostgreSQL"],
  "extractedSkills": ["Java", "Spring Boot", "Angular", "Git", "TypeScript", "REST APIs"],
  "explanation": "Candidate CV documents 3 of 5 required skills (60.0% overlap).\n\n• Matched Competencies: Java, Spring Boot, Angular\n• Required Skills Not Detected: Docker, PostgreSQL\n\nNotice: This automated assessment calculates documented keyword overlap from the uploaded PDF CV.",
  "aiProvider": "LOCAL",
  "createdAt": "2026-10-13T14:45:00Z"
}
```

#### `GET /api/applications/{id}/analysis`
Retrieves stored AI analysis for an application.

---

### 2.6 System Health Check (`/api/health`)

#### `GET /api/health`
Container and application health check endpoint used by Docker health checks.
```json
{
  "status": "UP",
  "service": "HireSmart AI Backend",
  "timestamp": "2026-10-13T14:50:00Z",
  "aiEngine": "Active (Apache PDFBox + Deterministic Matcher)",
  "database": "Connected"
}
```
