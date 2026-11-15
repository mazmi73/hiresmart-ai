# HireSmart AI — PFE Demonstration & Defense Guide
**Step-by-Step Presentation Script for Final-Year Engineering Project Defense**

---

## 1. Demonstration Credentials Matrix

| Role | Email | Password | Display Name / Entity |
| :--- | :--- | :--- | :--- |
| **Recruiter** | `recruiter@hiresmart.ai` | `Recruiter123!` | TechNova Innovations |
| **Candidate** | `candidate@hiresmart.ai` | `Candidate123!` | Alex Vance |
| **Candidate (Secondary)** | `john.doe@example.com` | `Candidate123!` | John Doe |

---

## 2. System Launch & Infrastructure Verification

### Step 2.1 — Start Containerized Platform
From the repository root directory, run:
```bash
docker compose up --build -d
```

### Step 2.2 — Validate Container Health
```bash
docker compose ps
```
Ensure all three containers (`hiresmart-frontend`, `hiresmart-backend`, `hiresmart-database`) are running and healthy.

### Step 2.3 — Access Points
- **Frontend SPA**: [http://localhost:4200](http://localhost:4200/)
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
- **Interactive Swagger Documentation**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Backend Health Check**: [http://localhost:8080/api/health](http://localhost:8080/api/health)

---

## 3. End-to-End PFE Defense Demonstration Workflow

### Scenario: The 60% Skills Overlap Verification

#### Phase 1 — Recruiter Creates Job Offer
1. Open browser at [http://localhost:4200](http://localhost:4200/).
2. Navigate to **Sign In** and click the **Recruiter Demo** quick-fill button (`recruiter@hiresmart.ai`).
3. Click **Sign In**. Observe the **Recruiter Dashboard** displaying total jobs, active jobs, and pipeline statistics.
4. Click **Create Job Offer** (or navigate to **Manage Jobs** &rarr; **Post New Job**).
5. Enter the following specifications:
   - **Job Title**: `Senior Full-Stack Engineer`
   - **Company**: `TechNova Innovations`
   - **Location**: `Paris, France (Hybrid)`
   - **Employment Type**: `Full Time`
   - **Experience Level**: `Senior`
   - **Required Skills**: `Java, Spring Boot, Angular, Docker, PostgreSQL` *(5 mandatory skills)*
   - **Description**: `Architecting and implementing enterprise cloud-native recruitment platforms using Java 21, Spring Boot, Angular, and PostgreSQL.`
6. Click **Publish Job Offer**. Notice the success notification and the job appearing in the jobs table.

---

#### Phase 2 — Candidate Uploads CV & Applies
1. Click **Sign Out** in the top navigation bar.
2. Click **Sign In** and use the **Candidate Demo** quick-fill button (`candidate@hiresmart.ai`).
3. Click **Sign In**.
4. On the **Candidate Portal**, observe the profile overview.
5. Upload the test synthetic PDF CV located at `test-assets/synthetic_alex_vance_cv.pdf`:
   - Click **Upload PDF CV** (or drag & drop).
   - Apache PDFBox extracts the text in the backend and saves the document to the persistent volume.
6. Click **Browse Jobs** in the navigation bar.
7. Locate the **Senior Full-Stack Engineer** position created in Phase 1.
8. Click **View & Apply**.
9. In the application modal, verify that the uploaded CV is pre-selected. Enter an optional cover note:
   `"Excited to apply. Experienced with enterprise Spring Boot backends and Angular SPAs."`
10. Click **Confirm Application**. The application is confirmed and recorded.
11. Attempting to click **Apply** again immediately verifies the duplicate application guardrail (error prevents multiple submissions).

---

#### Phase 3 — Recruiter Runs AI Skills Analysis
1. Sign out of the candidate account.
2. Sign back in as the Recruiter (`recruiter@hiresmart.ai`).
3. Navigate to **Candidates & CVs** (or click the applicant link on the job).
4. Locate the newly submitted application by **Alex Vance**.
5. Click **Download PDF** to demonstrate secure, authorized streaming of the stored resume.
6. Click **Run AI Analysis** (or **View AI Match**).
7. **Jury Verification Moment**: The AI Analysis Panel opens displaying:
   - **Radial Overlap Gauge**: **60.0% Overlap**
   - **Matched Competencies**: `Java`, `Spring Boot`, `Angular` (3 skills highlighted in emerald)
   - **Required Skills Not Detected**: `Docker`, `PostgreSQL` (2 skills highlighted in rose)
   - **Mathematical Explanation**: $3 / 5 \times 100 = 60.0\%$
   - **Ethical AI Disclaimer**: Explaining that this calculation measures documented keyword overlap and acts strictly as a decision support aid.

---

#### Phase 4 — Recruiter Updates Application Status
1. On the application row, change the status dropdown from `SUBMITTED` to **`INTERVIEW`**.
2. Notice the live status badge update and confirmation toast.

---

#### Phase 5 — Candidate Verifies Updated Status & AI Feedback
1. Sign out of the recruiter account.
2. Sign back in as Candidate (`candidate@hiresmart.ai`).
3. Navigate to **My Applications**.
4. Confirm that the application status displays **`INTERVIEW`** with the purple badge.
5. Click **Skills Match Analysis** to demonstrate that candidates also have full, transparent access to their skills match breakdown.

---

## 4. Key Questions & Architecture Answers for the Jury

| Jury Question | Recommended Answer |
| :--- | :--- |
| **Why a Modular Monolith instead of Microservices?** | A modular monolith provides clean domain separation without the network latency, distributed transaction complexity, and orchestration overhead of Kubernetes and message queues, matching the project's scale and 7-day delivery objective. |
| **How does the AI matching engine avoid hallucination?** | The primary engine is deterministic: Apache PDFBox extracts the raw text and an indexed alias dictionary normalizes skills using strict regex boundaries. No generative model can alter the numerical overlap calculation. |
| **How is candidate data secured?** | Passwords use BCrypt with cost factor 10. Passwords and CV files are not publicly accessible via static web directories. Endpoints verify candidate ownership and recruiter job assignment before streaming files. |
| **What happens if Google Gemini is down or unconfigured?** | The backend incorporates a fallback design. The local deterministic engine executes independently of external APIs, ensuring 100% operational availability without paid API subscriptions. |
