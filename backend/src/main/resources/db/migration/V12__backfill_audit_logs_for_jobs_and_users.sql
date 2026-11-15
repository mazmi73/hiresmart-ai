-- V12__backfill_audit_logs_for_jobs_and_users.sql

-- 1. Standardize legacy USER_PROVISIONED actions to USER_REGISTER
UPDATE audit_logs
SET action = 'USER_REGISTER'
WHERE action = 'USER_PROVISIONED';

-- 2. Standardize legacy JOB_POSTED_BY_ADMIN actions to JOB_CREATED
UPDATE audit_logs
SET action = 'JOB_CREATED'
WHERE action = 'JOB_POSTED_BY_ADMIN';

-- 3. Backfill USER_REGISTER audit logs for all users in users table who do not have one
INSERT INTO audit_logs (action, actor_email, actor_role, target_resource, details, created_at)
SELECT
    'USER_REGISTER',
    u.email,
    u.role,
    'User #' || u.id,
    'Account created as ' || u.role,
    COALESCE(u.created_at, NOW())
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM audit_logs a
    WHERE a.action = 'USER_REGISTER'
      AND (a.actor_email = u.email OR a.target_resource = 'User #' || u.id)
);

-- 4. Backfill JOB_CREATED audit logs for all job offers in job_offers table who do not have one
INSERT INTO audit_logs (action, actor_email, actor_role, target_resource, details, created_at)
SELECT
    'JOB_CREATED',
    u.email,
    u.role,
    'Job Offer #' || j.id,
    j.title || ' job offer posted by ' || j.company_name,
    COALESCE(j.created_at, NOW())
FROM job_offers j
JOIN users u ON j.recruiter_id = u.id
WHERE NOT EXISTS (
    SELECT 1 FROM audit_logs a
    WHERE a.action = 'JOB_CREATED'
      AND a.target_resource = 'Job Offer #' || j.id
);
