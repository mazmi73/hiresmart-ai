# E2E Workflow Verification Script for HireSmart AI Docker Environment

$baseUrl = "http://localhost:4200/api"

Write-Host "=== STEP 1: Log in as Recruiter ===" -ForegroundColor Cyan
$recruiterLoginPayload = @{
    email = "recruiter@hiresmart.ai"
    password = "Recruiter123!"
} | ConvertTo-Json

$recruiterAuth = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $recruiterLoginPayload -ContentType "application/json"
$recruiterToken = $recruiterAuth.token
Write-Host "Recruiter logged in. Token acquired: $($recruiterToken.Substring(0, 20))..." -ForegroundColor Green

Write-Host "`n=== STEP 2: Create a job requiring Java, Spring Boot, Angular, Docker and PostgreSQL ===" -ForegroundColor Cyan
$newJobPayload = @{
    title = "Principal Full-Stack Architect"
    description = "Lead the design and development of our intelligent recruitment platform."
    companyName = "TechNova Innovations"
    location = "Paris, France"
    employmentType = "FULL_TIME"
    experienceLevel = "LEAD"
    requiredSkills = "Java, Spring Boot, Angular, Docker, PostgreSQL"
} | ConvertTo-Json

$recruiterHeaders = @{
    Authorization = "Bearer $recruiterToken"
}

$createdJob = Invoke-RestMethod -Uri "$baseUrl/jobs" -Method Post -Headers $recruiterHeaders -Body $newJobPayload -ContentType "application/json"
$jobId = $createdJob.id
Write-Host "Created Job ID: $jobId, Title: $($createdJob.title), Required Skills: $($createdJob.requiredSkills)" -ForegroundColor Green

Write-Host "`n=== STEP 3: Log in as Candidate ===" -ForegroundColor Cyan
$candidateLoginPayload = @{
    email = "candidate@hiresmart.ai"
    password = "Candidate123!"
} | ConvertTo-Json

$candidateAuth = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $candidateLoginPayload -ContentType "application/json"
$candidateToken = $candidateAuth.token
$candidateHeaders = @{
    Authorization = "Bearer $candidateToken"
}
Write-Host "Candidate logged in: $($candidateAuth.displayName)" -ForegroundColor Green

Write-Host "`n=== STEP 4: Upload synthetic PDF CV containing Java, Spring Boot, Angular and Git ===" -ForegroundColor Cyan
$cvPath = "c:\Users\J_jolam\Downloads\HireSmart AI\test-assets\synthetic_alex_vance_cv.pdf"

# Upload CV using curl or multipart form
$uploadResult = curl.exe -s -X POST "$baseUrl/candidates/cv" `
    -H "Authorization: Bearer $candidateToken" `
    -F "file=@$cvPath;type=application/pdf" | ConvertFrom-Json

Write-Host "CV Uploaded: $($uploadResult.cvOriginalName), hasCv: $($uploadResult.hasCv)" -ForegroundColor Green

Write-Host "`n=== STEP 5: Apply to the created job ===" -ForegroundColor Cyan
$applyResult = Invoke-RestMethod -Uri "$baseUrl/jobs/$jobId/apply-saved?coverLetter=Excited to apply as Principal Architect" `
    -Method Post -Headers $candidateHeaders

$appId = $applyResult.id
Write-Host "Applied successfully. Application ID: $appId, Status: $($applyResult.status)" -ForegroundColor Green

Write-Host "`n=== STEP 5b: Verify duplicate application prevention ===" -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri "$baseUrl/jobs/$jobId/apply-saved" -Method Post -Headers $candidateHeaders
    Write-Host "ERROR: Duplicate application was not prevented!" -ForegroundColor Red
} catch {
    Write-Host "Success: Duplicate application correctly rejected with status $($_.Exception.Response.StatusCode)" -ForegroundColor Green
}

Write-Host "`n=== STEP 6 & 7: Recruiter reviews application & runs AI analysis ===" -ForegroundColor Cyan
$analysis = Invoke-RestMethod -Uri "$baseUrl/applications/$appId/analyze" -Method Post -Headers $recruiterHeaders

Write-Host "AI Skills Overlap Score: $($analysis.matchPercentage)%" -ForegroundColor Magenta
Write-Host "Matched Skills: $($analysis.matchedSkills -join ', ')" -ForegroundColor Green
Write-Host "Missing Required Skills: $($analysis.missingSkills -join ', ')" -ForegroundColor Yellow
Write-Host "Extracted Document Skills: $($analysis.extractedSkills -join ', ')" -ForegroundColor Cyan
Write-Host "Plain Explanation:`n$($analysis.explanation)" -ForegroundColor White

if ($analysis.matchPercentage -eq 60.0) {
    Write-Host "`n>>> VERIFICATION SUCCESS: Match score is EXACTLY 60.0%! <<<" -ForegroundColor Green
} else {
    Write-Host "`n>>> WARNING: Match score was $($analysis.matchPercentage)% (Expected: 60.0%) <<<" -ForegroundColor Red
}

Write-Host "`n=== STEP 8: Recruiter updates application status to INTERVIEW ===" -ForegroundColor Cyan
$statusUpdatePayload = @{
    status = "INTERVIEW"
} | ConvertTo-Json

$updatedApp = Invoke-RestMethod -Uri "$baseUrl/applications/$appId/status" -Method Patch -Headers $recruiterHeaders -Body $statusUpdatePayload -ContentType "application/json"
Write-Host "Updated status: $($updatedApp.status)" -ForegroundColor Green

Write-Host "`n=== STEP 9: Candidate logs in / checks updated status ===" -ForegroundColor Cyan
$candidateApps = Invoke-RestMethod -Uri "$baseUrl/candidates/applications" -Method Get -Headers $candidateHeaders
$myApp = $candidateApps | Where-Object { $_.id -eq $appId }
Write-Host "Candidate sees status: $($myApp.status)" -ForegroundColor Green

if ($myApp.status -eq "INTERVIEW") {
    Write-Host "`n>>> COMPLETE END-TO-END WORKFLOW VERIFIED SUCCESSFULLY! <<<" -ForegroundColor Green
} else {
    Write-Host "`n>>> ERROR: Candidate did not see INTERVIEW status <<<" -ForegroundColor Red
}
