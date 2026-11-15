import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobService } from '../../core/services/job.service';
import { AuthService } from '../../core/services/auth.service';
import { CandidateService } from '../../core/services/candidate.service';
import { EmploymentType, ExperienceLevel, JobOffer, Page, WorkplaceType } from '../../core/models/job.models';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Browse Open Positions</h1>
        <p class="text-sm text-slate-500 mt-1">Explore career opportunities across leading industries in Morocco verified by intelligent skill matching</p>
      </div>

      <!-- Search & Filter Bar -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-8 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <!-- Keyword -->
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="keyword"
              (keyup.enter)="loadJobs(0)"
              placeholder="Title, skill, company, workplace or domain..."
              class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          <!-- Location -->
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="location"
              (keyup.enter)="loadJobs(0)"
              placeholder="City or Remote..."
              class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
          </div>

          <!-- Workplace Type -->
          <div>
            <select
              [(ngModel)]="workplaceType"
              (change)="loadJobs(0)"
              class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">All Workplaces</option>
              <option value="ON_SITE">🏢 On-site</option>
              <option value="HYBRID">🔄 Hybrid</option>
              <option value="REMOTE">🌐 Remote</option>
            </select>
          </div>

          <!-- Employment Type -->
          <div>
            <select
              [(ngModel)]="employmentType"
              (change)="loadJobs(0)"
              class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">All Employment Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>

          <!-- Experience Level -->
          <div>
            <select
              [(ngModel)]="experienceLevel"
              (change)="loadJobs(0)"
              class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">All Experience Levels</option>
              <option value="JUNIOR">Junior</option>
              <option value="MID_LEVEL">Mid Level</option>
              <option value="SENIOR">Senior</option>
              <option value="LEAD">Lead / Architect</option>
            </select>
          </div>
        </div>

        <!-- Domain / Industry Quick Filters -->
        <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Domains:</span>
          <button
            *ngFor="let dom of domainFilters"
            type="button"
            (click)="selectDomain(dom.query)"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition"
            [ngClass]="activeDomain === dom.query ? 'bg-brand-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          >
            {{ dom.label }}
          </button>
        </div>

        <!-- Workplace Quick Filters -->
        <div class="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Workplace:</span>
          <button
            *ngFor="let wp of workplaceFilters"
            type="button"
            (click)="selectWorkplace(wp.value)"
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
            [ngClass]="workplaceType === wp.value ? 'bg-brand-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          >
            <span>{{ wp.icon }}</span>
            <span>{{ wp.label }}</span>
          </button>
        </div>

        <div class="flex items-center justify-between pt-1">
          <span class="text-xs text-slate-500">
            Showing <strong class="text-slate-800">{{ pageData?.totalElements || 0 }}</strong> job postings
          </span>
          <div class="space-x-2">
            <button
              (click)="resetFilters()"
              class="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
            >
              Clear Filters
            </button>
            <button
              (click)="loadJobs(0)"
              class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              Search Positions
            </button>
          </div>
        </div>
      </div>

      <!-- Jobs Grid -->
      <div *ngIf="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
        <p class="mt-2 text-sm text-slate-500">Searching opportunities...</p>
      </div>

      <div *ngIf="!loading && (!pageData || pageData.content.length === 0)" class="text-center py-20 bg-white rounded-2xl border border-slate-200">
        <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 class="text-base font-bold text-slate-800">No matching jobs found</h3>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try broadening your search keywords or resetting employment filters.</p>
        <button (click)="resetFilters()" class="mt-4 px-4 py-2 bg-brand-50 text-brand-700 rounded-lg text-xs font-semibold hover:bg-brand-100 transition">
          Reset All Filters
        </button>
      </div>

      <div *ngIf="!loading && pageData && pageData.content.length > 0" class="space-y-4">
        <div
          *ngFor="let job of pageData.content"
          class="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-brand-300 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                {{ formatType(job.employmentType) }}
              </span>
              <span 
                class="px-2.5 py-0.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1"
                [ngClass]="{
                  'bg-emerald-50 text-emerald-700 border-emerald-200': job.workplaceType === 'REMOTE',
                  'bg-indigo-50 text-indigo-700 border-indigo-200': job.workplaceType === 'HYBRID',
                  'bg-slate-50 text-slate-700 border-slate-200': !job.workplaceType || job.workplaceType === 'ON_SITE'
                }"
              >
                <span>{{ formatWorkplaceIcon(job.workplaceType) }}</span>
                <span>{{ formatWorkplace(job.workplaceType) }}</span>
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {{ formatLevel(job.experienceLevel) }}
              </span>
              <span *ngIf="isMyJob(job)" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                Your Job Posting
              </span>
              <span
                *ngIf="authService.isCandidate() && hasApplied(job.id)"
                class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1"
              >
                <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Already Applied
              </span>
            </div>

            <h2 class="text-xl font-bold text-slate-900 hover:text-brand-600 transition">
              <a [routerLink]="['/jobs', job.id]">{{ job.title }}</a>
            </h2>

            <div class="mt-1 flex items-center text-sm font-medium text-slate-600 space-x-3">
              <span>{{ job.companyName }}</span>
              <span>&bull;</span>
              <span class="flex items-center">
                <svg class="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                {{ job.location }}
              </span>
            </div>

            <p class="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {{ job.description }}
            </p>

            <!-- Skills -->
            <div class="mt-4 flex flex-wrap gap-1.5 items-center">
              <span class="text-[11px] font-bold text-slate-600 uppercase tracking-wider mr-1">Required:</span>
              <span
                *ngFor="let skill of splitSkills(job.requiredSkills)"
                class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="flex md:flex-col items-center md:items-end justify-between md:justify-center flex-shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
            <span class="text-xs text-slate-600">Posted {{ job.createdAt | date:'mediumDate' }}</span>

            <!-- Recruiter: Created by this recruiter (has option to manage) -->
            <ng-container *ngIf="isMyJob(job)">
              <a
                [routerLink]="['/jobs', job.id]"
                class="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
              >
                <span>Manage Job</span>
                <span *ngIf="job.applicantCount !== undefined" class="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-900 text-purple-100">
                  {{ job.applicantCount }}
                </span>
              </a>
            </ng-container>

            <!-- Recruiter: NOT created by this recruiter (View only, no apply, no manage) -->
            <ng-container *ngIf="authService.isRecruiter() && !isMyJob(job)">
              <a
                [routerLink]="['/jobs', job.id]"
                class="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                View Details
              </a>
            </ng-container>

            <!-- Administrator: View Details only (No apply) -->
            <ng-container *ngIf="authService.isAdmin()">
              <a
                [routerLink]="['/jobs', job.id]"
                class="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span>View Details</span>
              </a>
            </ng-container>

            <!-- Candidate who has ALREADY applied: View Details button (Green with checkmark) -->
            <ng-container *ngIf="authService.isCandidate() && hasApplied(job.id)">
              <a
                [routerLink]="['/jobs', job.id]"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm hover:shadow-md flex items-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span>View Details</span>
              </a>
            </ng-container>

            <!-- Candidate who has NOT applied or Guest: View & Apply -->
            <ng-container *ngIf="!authService.isAdmin() && !authService.isRecruiter() && !(authService.isCandidate() && hasApplied(job.id))">
              <a
                [routerLink]="['/jobs', job.id]"
                class="px-5 py-2.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                View & Apply
              </a>
            </ng-container>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div *ngIf="pageData.totalPages > 1" class="flex items-center justify-between pt-6">
          <button
            [disabled]="pageData.first"
            (click)="loadJobs(pageData.number - 1)"
            class="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &larr; Previous Page
          </button>
          <span class="text-xs text-slate-500">
            Page {{ pageData.number + 1 }} of {{ pageData.totalPages }}
          </span>
          <button
            [disabled]="pageData.last"
            (click)="loadJobs(pageData.number + 1)"
            class="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next Page &rarr;
          </button>
        </div>
      </div>
    </div>
  `
})
export class JobListComponent implements OnInit {
  keyword = '';
  location = '';
  employmentType: EmploymentType | '' = '';
  workplaceType: WorkplaceType | '' = '';
  experienceLevel: ExperienceLevel | '' = '';
  pageData: Page<JobOffer> | null = null;
  loading = true;
  appliedJobIds = new Set<number>();

  constructor(
    private jobService: JobService,
    private candidateService: CandidateService,
    public authService: AuthService
  ) {}

  isMyJob(job: JobOffer): boolean {
    const user = this.authService.getCurrentUser();
    return !!(user && this.authService.isRecruiter() && job.recruiterId === user.id);
  }

  hasApplied(jobId: number): boolean {
    return this.appliedJobIds.has(jobId);
  }

  ngOnInit(): void {
    this.loadJobs(0);
    this.loadCandidateApplications();
  }

  loadCandidateApplications(): void {
    if (this.authService.isCandidate()) {
      this.candidateService.getMyApplications().subscribe({
        next: (apps) => {
          this.appliedJobIds = new Set(apps.map(a => a.jobOfferId));
        },
        error: () => {}
      });
    }
  }

  activeDomain = '';
  domainFilters = [
    { label: 'All Domains', query: '' },
    { label: 'Banking & Finance', query: 'Banking' },
    { label: 'Sales & Business Dev', query: 'Sales' },
    { label: 'Retail & Commerce', query: 'Retail' },
    { label: 'Automotive & Manufacturing', query: 'Automotive' },
    { label: 'Customer Service & BPO', query: 'Customer Service' },
    { label: 'Consulting & Project Mgmt', query: 'Project Manager' },
    { label: 'Insurance', query: 'Insurance' },
    { label: 'IT & Software Development', query: 'Software' },
    { label: 'Telecommunications', query: 'Telecom' }
  ];

  workplaceFilters = [
    { label: 'All Workplaces', value: '' as WorkplaceType | '', icon: '✨' },
    { label: 'On-site', value: 'ON_SITE' as WorkplaceType | '', icon: '🏢' },
    { label: 'Hybrid', value: 'HYBRID' as WorkplaceType | '', icon: '🔄' },
    { label: 'Remote', value: 'REMOTE' as WorkplaceType | '', icon: '🌐' }
  ];

  selectWorkplace(type: WorkplaceType | '') {
    this.workplaceType = type;
    this.loadJobs(0);
  }

  selectDomain(query: string) {
    if (this.activeDomain === query && query !== '') {
      this.activeDomain = '';
      this.keyword = '';
    } else {
      this.activeDomain = query;
      this.keyword = query;
    }
    this.loadJobs(0);
  }

  loadJobs(page = 0) {
    this.loading = true;
    this.jobService.searchJobs(this.keyword, this.location, this.employmentType, this.experienceLevel, page, 10, this.workplaceType).subscribe({
      next: (res) => {
        this.pageData = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load job listings:', err);
        this.loading = false;
      }
    });
  }

  resetFilters() {
    this.keyword = '';
    this.location = '';
    this.employmentType = '';
    this.workplaceType = '';
    this.experienceLevel = '';
    this.activeDomain = '';
    this.loadJobs(0);
  }

  splitSkills(skills: string): string[] {
    if (!skills) return [];
    return skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  formatType(type: string): string {
    return type ? type.replace('_', ' ') : '';
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

  formatLevel(level: string): string {
    return level ? level.replace('_', ' ') : '';
  }
}
