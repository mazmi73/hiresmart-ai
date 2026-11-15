import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecruiterService } from '../../core/services/recruiter.service';
import { ApplicationService } from '../../core/services/application.service';
import { JobService } from '../../core/services/job.service';
import { ToastService } from '../../core/services/toast.service';
import { RecruiterDashboardStats } from '../../core/models/recruiter.models';
import { Application, ApplicationStatus, CVAnalysis } from '../../core/models/application.models';
import { JobOffer } from '../../core/models/job.models';
import { AiAnalysisModalComponent } from '../../shared/ai-analysis-modal.component';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AiAnalysisModalComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Recruiter Dashboard</h1>
          <p class="text-sm text-slate-500 mt-1">Platform metrics, recruitment analytics, and AI CV screening</p>
        </div>
        <div class="flex items-center space-x-3">
          <a
            routerLink="/recruiter/jobs/new"
            class="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition shadow-sm flex items-center"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Create Job Offer
          </a>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Card 1 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Job Offers</p>
            <p class="text-3xl font-extrabold text-slate-900 mt-1">{{ stats?.totalJobs || 0 }}</p>
            <p class="text-[11px] text-slate-500 mt-1">Managed positions</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Offers</p>
            <p class="text-3xl font-extrabold text-slate-900 mt-1">{{ stats?.activeJobs || 0 }}</p>
            <p class="text-[11px] text-slate-500 mt-1">Accepting applications</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total Applications</p>
            <p class="text-3xl font-extrabold text-slate-900 mt-1">{{ stats?.totalApplications || 0 }}</p>
            <p class="text-[11px] text-slate-500 mt-1">Candidates applied</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-amber-600 uppercase tracking-wider">Under Review</p>
            <p class="text-3xl font-extrabold text-slate-900 mt-1">{{ stats?.applicationsUnderReview || 0 }}</p>
            <p class="text-[11px] text-slate-500 mt-1">Pending screening</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Quick Action Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900">Manage Job Offers</h3>
            <p class="text-xs text-slate-500 mt-1">Edit job specifications, close positions, or update required skills.</p>
          </div>
          <a routerLink="/recruiter/jobs" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition">
            View All Jobs &rarr;
          </a>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900">Application Pipeline</h3>
            <p class="text-xs text-slate-500 mt-1">Review candidates, download PDF resumes, and run AI match analyses.</p>
          </div>
          <a routerLink="/recruiter/applications" class="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition">
            Candidate Pipeline &rarr;
          </a>
        </div>
      </div>

      <!-- Recent Applications Table (Placed on Top) -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Recent Candidate Applications</h2>
            <p class="text-xs text-slate-500 mt-0.5">Latest submissions ready for recruiter review and CV analysis</p>
          </div>
          <a routerLink="/recruiter/applications" class="text-xs font-semibold text-brand-600 hover:text-brand-800">
            View full pipeline &rarr;
          </a>
        </div>

        <div *ngIf="loading" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
          <p class="mt-2 text-sm text-slate-500">Loading recruiter dashboard...</p>
        </div>

        <div *ngIf="!loading && (!stats?.recentApplications || stats?.recentApplications?.length === 0)" class="text-center py-16">
          <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <h3 class="text-sm font-bold text-slate-800">No applications received yet</h3>
          <p class="text-xs text-slate-500 mt-1">Applications submitted by candidates will appear here.</p>
        </div>

        <div *ngIf="!loading && stats?.recentApplications && stats?.recentApplications?.length! > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Target Job & AI Match</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">AI Analysis & Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr *ngFor="let app of stats?.recentApplications" class="hover:bg-slate-50/80 transition-colors">
                <td class="px-6 py-4">
                  <div class="text-sm font-bold text-slate-900">{{ app.candidateName || app.candidateEmail }}</div>
                  <div class="text-xs text-slate-500">{{ app.candidateEmail }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm font-medium text-slate-800 block">{{ app.jobTitle }}</span>
                  <div *ngIf="app.hasAnalysis" class="mt-1">
                    <span
                      class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs"
                      [ngClass]="app.matchPercentage! >= (app.matchThreshold || 70) ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
                    >
                      <svg *ngIf="app.matchPercentage! >= (app.matchThreshold || 70)" class="w-2.5 h-2.5 mr-1 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      {{ app.matchPercentage! >= (app.matchThreshold || 70) ? 'High Match (' + app.matchPercentage + '% ≥ ' + (app.matchThreshold || 70) + '%)' : app.matchPercentage + '% Match (< ' + (app.matchThreshold || 70) + '%)' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <select
                    [ngModel]="app.status"
                    (ngModelChange)="updateStatus(app.id, $event)"
                    class="text-xs font-bold rounded-lg px-2.5 py-1 border border-slate-300 focus:ring-brand-500 bg-white"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="INTERVIEW">INTERVIEW</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </td>
                <td class="px-6 py-4 text-xs text-slate-500">
                  {{ app.createdAt | date:'shortDate' }}
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button
                    (click)="openAnalysis(app)"
                    class="px-3 py-1.5 rounded-lg text-xs font-bold transition"
                    [ngClass]="app.hasAnalysis ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-xs'"
                  >
                    {{ app.hasAnalysis ? 'View Analysis (' + app.matchPercentage + '%)' : 'Run AI Analysis' }}
                  </button>
                  <button
                    (click)="downloadCv(app.id, app.cvOriginalName)"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Job Compatibility Threshold Settings (Placed Below Recent Applications) -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 class="text-lg font-bold text-slate-900">Job High Match Thresholds</h2>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              Customize the minimum AI skill compatibility percentage (%) required for candidates to earn the "High Match" badge on your job postings
            </p>
          </div>
          <a routerLink="/recruiter/jobs" class="text-xs font-semibold text-brand-600 hover:text-brand-800">
            View All Jobs &rarr;
          </a>
        </div>

        <div *ngIf="loadingJobs" class="text-center py-10">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-brand-500 border-t-transparent"></div>
          <p class="mt-1 text-xs text-slate-500">Loading your job thresholds...</p>
        </div>

        <div *ngIf="!loadingJobs && myJobs.length === 0" class="p-8 text-center text-xs text-slate-500">
          No job offers posted yet. Create your first job posting to customize its AI match threshold.
        </div>

        <div *ngIf="!loadingJobs && myJobs.length > 0" class="divide-y divide-slate-100">
          <div *ngFor="let job of myJobs" class="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/50 transition">
            
            <!-- Job Details -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center space-x-2.5">
                <h3 class="text-sm font-bold text-slate-900 truncate">{{ job.title }}</h3>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  [ngClass]="job.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'"
                >
                  {{ job.status }}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                {{ job.companyName }} &bull; {{ job.location }} &bull; {{ job.applicantCount || 0 }} Applicants
              </p>
            </div>

            <!-- Threshold Interactive Slider -->
            <div class="w-full lg:w-96 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-slate-700">High Match Threshold:</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-black text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
                  &ge; {{ jobThresholds[job.id] || 70 }}% Overlap
                </span>
              </div>

              <input
                type="range"
                min="40"
                max="95"
                step="5"
                [(ngModel)]="jobThresholds[job.id]"
                class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              <div class="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>40% (Lenient)</span>
                <div class="space-x-1">
                  <button
                    type="button"
                    (click)="jobThresholds[job.id] = 50"
                    class="px-1.5 py-0.5 rounded border text-[10px] transition"
                    [ngClass]="jobThresholds[job.id] === 50 ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
                  >50%</button>
                  <button
                    type="button"
                    (click)="jobThresholds[job.id] = 70"
                    class="px-1.5 py-0.5 rounded border text-[10px] transition"
                    [ngClass]="jobThresholds[job.id] === 70 ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
                  >70%</button>
                  <button
                    type="button"
                    (click)="jobThresholds[job.id] = 85"
                    class="px-1.5 py-0.5 rounded border text-[10px] transition"
                    [ngClass]="jobThresholds[job.id] === 85 ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
                  >85%</button>
                </div>
                <span>95% (Strict)</span>
              </div>
            </div>

            <!-- Save Action Button -->
            <div class="flex items-center">
              <button
                (click)="saveThreshold(job)"
                [disabled]="savingThresholdId === job.id"
                class="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition shadow-xs whitespace-nowrap inline-flex items-center"
              >
                <svg *ngIf="savingThresholdId === job.id" class="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ savingThresholdId === job.id ? 'Saving...' : 'Save Threshold' }}
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- AI Analysis Modal Component -->
      <app-ai-analysis-modal
        [analysis]="selectedAnalysis"
        (close)="selectedAnalysis = null"
      ></app-ai-analysis-modal>
    </div>
  `
})
export class RecruiterDashboardComponent implements OnInit {
  stats: RecruiterDashboardStats | null = null;
  myJobs: JobOffer[] = [];
  jobThresholds: { [jobId: number]: number } = {};
  loading = true;
  loadingJobs = true;
  savingThresholdId: number | null = null;
  selectedAnalysis: CVAnalysis | null = null;

  constructor(
    private recruiterService: RecruiterService,
    private applicationService: ApplicationService,
    private jobService: JobService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadJobs();
  }

  loadStats() {
    this.loading = true;
    this.recruiterService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Failed to load recruiter statistics');
      }
    });
  }

  loadJobs() {
    this.loadingJobs = true;
    this.recruiterService.getMyJobs().subscribe({
      next: (jobs) => {
        this.myJobs = jobs;
        this.jobThresholds = {};
        for (const job of jobs) {
          this.jobThresholds[job.id] = job.matchThreshold || 70;
        }
        this.loadingJobs = false;
      },
      error: () => {
        this.loadingJobs = false;
      }
    });
  }

  saveThreshold(job: JobOffer) {
    const newThreshold = this.jobThresholds[job.id] || 70;
    this.savingThresholdId = job.id;
    this.jobService.updateJobThreshold(job.id, newThreshold).subscribe({
      next: (updated) => {
        this.savingThresholdId = null;
        job.matchThreshold = updated.matchThreshold;
        this.toastService.success(`High Match Threshold for "${job.title}" set to ${updated.matchThreshold}%.`, 'Threshold Updated');
        this.loadStats();
      },
      error: (err) => {
        this.savingThresholdId = null;
        this.toastService.error(err.error?.message || 'Could not update threshold');
      }
    });
  }

  updateStatus(appId: number, newStatus: ApplicationStatus) {
    this.applicationService.updateStatus(appId, newStatus).subscribe({
      next: () => {
        this.toastService.success(`Status updated to ${newStatus}`, 'Updated');
        this.loadStats();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Could not update status');
      }
    });
  }

  openAnalysis(app: any) {
    if (app.hasAnalysis) {
      this.applicationService.getAnalysis(app.id).subscribe({
        next: (analysis) => this.selectedAnalysis = analysis,
        error: () => this.analyzeCv(app.id)
      });
    } else {
      this.analyzeCv(app.id);
    }
  }

  analyzeCv(appId: number) {
    this.applicationService.analyzeApplication(appId).subscribe({
      next: (analysis) => {
        this.selectedAnalysis = analysis;
        this.toastService.success(`AI Skill match computed: ${analysis.matchPercentage}% overlap`, 'Analysis Completed');
        this.loadStats();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'AI CV analysis failed');
      }
    });
  }

  downloadCv(appId: number, filename?: string) {
    this.applicationService.downloadCv(appId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'Candidate_CV.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toastService.error('Could not download CV document')
    });
  }
}
