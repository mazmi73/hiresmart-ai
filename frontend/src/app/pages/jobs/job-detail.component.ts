import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../core/services/job.service';
import { CandidateService } from '../../core/services/candidate.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { JobOffer } from '../../core/models/job.models';
import { CandidateProfile } from '../../core/models/candidate.models';
import { Application } from '../../core/models/application.models';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div *ngIf="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
        <p class="mt-2 text-sm text-slate-500">Loading job details...</p>
      </div>

      <div *ngIf="!loading && job" class="space-y-8">
        <!-- Back button -->
        <a routerLink="/jobs" class="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-600 transition">
          &larr; Back to all job postings
        </a>

        <!-- Header Card -->
        <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div class="flex flex-wrap gap-2 mb-3">
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                  {{ job.employmentType.replace('_', ' ') }}
                </span>
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold border inline-flex items-center gap-1"
                  [ngClass]="{
                    'bg-emerald-50 text-emerald-700 border-emerald-200': job.workplaceType === 'REMOTE',
                    'bg-indigo-50 text-indigo-700 border-indigo-200': job.workplaceType === 'HYBRID',
                    'bg-slate-50 text-slate-700 border-slate-200': !job.workplaceType || job.workplaceType === 'ON_SITE'
                  }"
                >
                  <span>{{ formatWorkplaceIcon(job.workplaceType) }}</span>
                  <span>{{ formatWorkplace(job.workplaceType) }}</span>
                </span>
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {{ job.experienceLevel.replace('_', ' ') }}
                </span>
                <span *ngIf="job.status === 'CLOSED'" class="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Position Closed
                </span>
                <span *ngIf="isJobOwner()" class="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  Your Job Posting
                </span>
                <span *ngIf="authService.isRecruiter() && !isJobOwner()" class="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  Other Company Posting
                </span>
                <span *ngIf="authService.isCandidate() && hasAppliedToThisJob" class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  Already Applied
                </span>
              </div>

              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{{ job.title }}</h1>
              
              <div class="mt-2 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
                <span class="text-slate-900 font-semibold">{{ job.companyName }}</span>
                <span>&bull;</span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </svg>
                  {{ job.location }}
                </span>
                <span>&bull;</span>
                <span class="text-xs text-slate-600">Posted {{ job.createdAt | date:'mediumDate' }}</span>
              </div>
            </div>

            <!-- Apply CTA / Recruiter Management in Header -->
            <div class="flex-shrink-0">
              <!-- Candidate Action -->
              <ng-container *ngIf="authService.isCandidate()">
                <!-- Case 1: Candidate has NOT applied yet -->
                <ng-container *ngIf="!hasAppliedToThisJob">
                  <button
                    *ngIf="job.status === 'ACTIVE'"
                    (click)="openApplyModal = true"
                    class="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/20 transition-all"
                  >
                    Apply For Position
                  </button>
                  <div *ngIf="job.status === 'CLOSED'" class="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold">
                    Position Closed
                  </div>
                </ng-container>

                <!-- Case 2: Candidate has ALREADY applied -->
                <ng-container *ngIf="hasAppliedToThisJob">
                  <div class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs">
                    <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>Already Applied</span>
                  </div>
                </ng-container>
              </ng-container>

              <!-- Unauthenticated Guest -->
              <ng-container *ngIf="!authService.isAuthenticated()">
                <a
                  routerLink="/auth/login"
                  class="w-full sm:w-auto inline-block text-center px-6 py-3 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all"
                >
                  Sign In as Candidate to Apply
                </a>
              </ng-container>

              <!-- Administrator View -->
              <ng-container *ngIf="authService.isAdmin()">
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <span>Admin View &bull; Read Only</span>
                  </span>
                  <a
                    routerLink="/admin/jobs"
                    class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all gap-1"
                  >
                    <span>Manage in Admin</span>
                    <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </ng-container>

              <!-- Recruiter View -->
              <ng-container *ngIf="authService.isRecruiter()">
                <!-- Recruiter who CREATED this job offer: Has option to manage application -->
                <div *ngIf="isJobOwner()" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <a
                    [routerLink]="['/recruiter/jobs', job.id, 'applications']"
                    class="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-700 hover:bg-purple-800 shadow-sm transition-all gap-1.5"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Manage Applications ({{ job.applicantCount || 0 }})
                  </a>
                  <a
                    [routerLink]="['/recruiter/jobs', job.id, 'edit']"
                    class="w-full sm:w-auto inline-block text-center px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all"
                  >
                    Edit Job
                  </a>
                </div>

                <!-- Recruiter who did NOT create this job: View only, NO option to manage application, NO option to apply -->
                <div *ngIf="!isJobOwner()" class="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <span>Recruiter View &bull; Read Only</span>
                </div>
              </ng-container>
            </div>
          </div>

          <!-- Required Skills -->
          <div class="pt-6 border-t border-slate-100">
            <h2 class="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Required Technical Competencies</h2>
            <div class="flex flex-wrap gap-2">
              <span
                *ngFor="let skill of splitSkills(job.requiredSkills)"
                class="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-xs"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <!-- Candidate Already Applied Informational Banner -->
        <div *ngIf="authService.isCandidate() && hasAppliedToThisJob && myApplication" class="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-bold text-emerald-950">You have already submitted an application for this position</h3>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {{ myApplication.status }}
                  </span>
                </div>
                <p class="text-xs text-emerald-800 mt-1">
                  Submitted on {{ myApplication.createdAt | date:'mediumDate' }}. Your application is under review and you cannot re-apply to this position.
                </p>
                <p *ngIf="myApplication.coverLetter" class="text-xs text-slate-600 italic mt-2 bg-white/80 p-2.5 rounded-lg border border-emerald-100/80">
                  "{{ myApplication.coverLetter }}"
                </p>
              </div>
            </div>
            <a
              routerLink="/candidate/dashboard"
              class="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Track in Dashboard &rarr;
            </a>
          </div>
        </div>

        <!-- Recruiter Read-Only Informational Banner -->
        <div *ngIf="authService.isRecruiter() && !isJobOwner()" class="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h4 class="text-xs font-bold text-amber-900">Browsing Other Recruiter's Job Offer</h4>
            <p class="text-xs text-amber-800 mt-0.5">
              You are logged in as a recruiter viewing a posting by <strong class="text-amber-950">{{ job.companyName }}</strong>. Only the authoring recruiter can manage applications and edit this offer, and only candidates can submit applications.
            </p>
          </div>
        </div>

        <!-- Administrator Read-Only Informational Banner -->
        <div *ngIf="authService.isAdmin()" class="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <div>
              <h4 class="text-xs font-bold text-emerald-950">Viewing Position as Platform Administrator</h4>
              <p class="text-xs text-emerald-800 mt-0.5">
                You are viewing this job offer in Read-Only mode. Job applications can only be submitted by registered candidates. To moderate or configure this posting, visit the <a routerLink="/admin/jobs" class="underline font-semibold hover:text-emerald-950">Admin Job Governance</a> page.
              </p>
            </div>
          </div>
          <a
            routerLink="/admin/jobs"
            class="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Moderate in Admin &rarr;
          </a>
        </div>

        <!-- Description Card -->
        <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 class="text-lg font-bold text-slate-900">Job Description & Responsibilities</h2>
          <div class="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
            {{ job.description }}
          </div>
        </div>
      </div>

      <!-- Apply Modal (Candidates Only who haven't applied yet) -->
      <div *ngIf="openApplyModal && authService.isCandidate() && !hasAppliedToThisJob" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-fadeIn">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 class="text-lg font-bold text-slate-900">Apply to {{ job?.title }}</h3>
            <button (click)="openApplyModal = false" class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="mt-4 space-y-4">
            <!-- Cover Letter -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Cover Note / Remarks</label>
              <textarea
                [(ngModel)]="coverLetter"
                rows="3"
                placeholder="Briefly explain why your background is a great match for this role..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              ></textarea>
            </div>

            <!-- CV Selection Option -->
            <div class="space-y-3">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Select CV Document</label>

              <!-- Option A: Use saved CV -->
              <div *ngIf="candidateProfile?.hasCv" class="p-3.5 rounded-xl border border-brand-200 bg-brand-50/60 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-900 truncate max-w-[220px]">{{ candidateProfile?.cvOriginalName }}</p>
                    <p class="text-[10px] text-brand-700 font-medium">Currently attached profile CV</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="cvChoice"
                  [checked]="!uploadNewCvMode"
                  (change)="uploadNewCvMode = false"
                  class="text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
              </div>

              <!-- Option B: Upload new PDF CV -->
              <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-300 text-slate-700 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-900">Upload a fresh CV</p>
                    <p class="text-[10px] text-slate-500">Max size 10MB (PDF, DOC, DOCX, TXT, RTF, ODT)</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="cvChoice"
                  [checked]="uploadNewCvMode"
                  (change)="uploadNewCvMode = true"
                  class="text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
              </div>

              <!-- File picker if uploadNewCvMode -->
              <div *ngIf="uploadNewCvMode || !candidateProfile?.hasCv" class="pt-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.rtf,.odt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  (change)="onFileSelected($event)"
                  class="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                />
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              (click)="openApplyModal = false"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              (click)="submitApplication()"
              [disabled]="submitting"
              class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition shadow-sm flex items-center"
            >
              <svg *ngIf="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? 'Submitting Application...' : 'Confirm Application' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class JobDetailComponent implements OnInit {
  job: JobOffer | null = null;
  loading = true;
  candidateProfile: CandidateProfile | null = null;

  hasAppliedToThisJob = false;
  myApplication: Application | null = null;
  myApplications: Application[] = [];

  openApplyModal = false;
  uploadNewCvMode = false;
  selectedFile: File | null = null;
  coverLetter = '';
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private candidateService: CandidateService,
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/jobs']);
      return;
    }

    this.jobService.getJobById(id).subscribe({
      next: (data) => {
        this.job = data;
        this.loading = false;
        this.checkAppliedStatus();
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Job offer not found');
        this.router.navigate(['/jobs']);
      }
    });

    if (this.authService.isCandidate()) {
      this.candidateService.getProfile().subscribe({
        next: (profile) => {
          this.candidateProfile = profile;
          this.uploadNewCvMode = !profile.hasCv;
        }
      });

      this.candidateService.getMyApplications().subscribe({
        next: (apps) => {
          this.myApplications = apps;
          this.checkAppliedStatus();
        }
      });
    }
  }

  checkAppliedStatus(): void {
    if (this.job && this.myApplications.length > 0) {
      const match = this.myApplications.find(a => a.jobOfferId === this.job!.id);
      if (match) {
        this.myApplication = match;
        this.hasAppliedToThisJob = true;
      }
    }
  }

  isJobOwner(): boolean {
    const user = this.authService.getCurrentUser();
    return !!(user && this.authService.isRecruiter() && this.job && this.job.recruiterId === user.id);
  }

  splitSkills(skills: string): string[] {
    if (!skills) return [];
    return skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowed = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!allowed.includes(ext)) {
        this.toastService.error(`Unsupported file format (.${ext}). Allowed: ${allowed.join(', ')}`);
        return;
      }
      this.selectedFile = file;
    }
  }

  submitApplication() {
    if (!this.job) return;

    if (!this.authService.isCandidate() || this.hasAppliedToThisJob) {
      this.toastService.error(this.hasAppliedToThisJob ? 'You have already applied for this job offer' : 'Only candidates are permitted to submit job applications');
      this.openApplyModal = false;
      return;
    }

    this.submitting = true;

    if (this.uploadNewCvMode) {
      if (!this.selectedFile) {
        this.toastService.error('Please choose a PDF file to upload');
        this.submitting = false;
        return;
      }

      this.jobService.applyWithUpload(this.job.id, this.coverLetter, this.selectedFile).subscribe({
        next: () => {
          this.submitting = false;
          this.openApplyModal = false;
          this.hasAppliedToThisJob = true;
          this.toastService.success('Your application has been submitted successfully!', 'Application Sent');
          this.router.navigate(['/candidate/dashboard']);
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Could not submit application');
        }
      });
    } else {
      if (!this.candidateProfile?.hasCv) {
        this.toastService.error('Please upload a CV document first');
        this.submitting = false;
        return;
      }

      this.jobService.applyWithSavedCv(this.job.id, this.coverLetter, this.candidateProfile.cvId).subscribe({
        next: () => {
          this.submitting = false;
          this.openApplyModal = false;
          this.hasAppliedToThisJob = true;
          this.toastService.success('Your application has been submitted successfully!', 'Application Sent');
          this.router.navigate(['/candidate/dashboard']);
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Could not submit application');
        }
      });
    }
  }

  formatWorkplace(type?: string): string {
    if (type === 'REMOTE') return 'Remote';
    if (type === 'HYBRID') return 'Hybrid';
    return 'On-site';
  }

  formatWorkplaceIcon(type?: string): string {
    if (type === 'REMOTE') return '🌐';
    if (type === 'HYBRID') return '🔄';
    return '🏢';
  }
}
