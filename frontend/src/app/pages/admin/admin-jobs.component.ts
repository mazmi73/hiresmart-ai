import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';
import { EmploymentType, ExperienceLevel, JobOffer, JobOfferRequest, WorkplaceType } from '../../core/models/job.models';

@Component({
  selector: 'app-admin-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      <!-- Breadcrumbs & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <a routerLink="/admin/dashboard" class="hover:text-brand-600">&larr; Admin Dashboard</a>
            <span>/</span>
            <span>Job Governance</span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Global Job Postings Governance</h1>
          <p class="text-xs text-slate-500 mt-0.5">Moderate, inspect, publish, and govern all recruitment postings across companies</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            (click)="openCreateJobModal()"
            class="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Publish Global Job
          </button>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {{ filteredJobs.length }} / {{ jobs.length }} Postings
          </span>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="w-full sm:w-80 relative">
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search by title, company, city, or skills..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div class="flex items-center space-x-1.5">
            <label class="text-xs font-bold text-slate-600 whitespace-nowrap">City:</label>
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="selectedCity"
                placeholder="Filter by city..."
                list="adminCitiesList"
                class="pl-7 pr-6 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white w-40"
              />
              <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <button 
                *ngIf="selectedCity"
                type="button"
                (click)="selectedCity = ''"
                class="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                title="Clear city filter"
              >&times;</button>
              <datalist id="adminCitiesList">
                <option value="Casablanca">
                <option value="Rabat">
                <option value="Marrakech">
                <option value="Tangier">
                <option value="Fes">
                <option value="Benguerir">
                <option value="Agadir">
                <option value="Paris">
                <option value="Lyon">
              </datalist>
            </div>
          </div>

          <div class="flex items-center space-x-1.5">
            <label class="text-xs font-bold text-slate-600 whitespace-nowrap">Status:</label>
            <select
              [(ngModel)]="selectedStatus"
              class="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Postings</option>
              <option value="CLOSED">Closed Postings</option>
            </select>
          </div>

          <div class="flex items-center space-x-1.5">
            <label class="text-xs font-bold text-slate-600 whitespace-nowrap">Workplace:</label>
            <select
              [(ngModel)]="selectedWorkplace"
              class="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="ALL">All Workplaces</option>
              <option value="ON_SITE">🏢 On-site</option>
              <option value="HYBRID">🔄 Hybrid</option>
              <option value="REMOTE">🌐 Remote</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Jobs Table -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        <div *ngIf="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
          <p class="mt-2 text-sm text-slate-500">Loading job postings...</p>
        </div>

        <div *ngIf="!loading && filteredJobs.length === 0" class="text-center py-16">
          <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="text-sm font-bold text-slate-800">No job postings found</h3>
          <p class="text-xs text-slate-500 mt-1">Try modifying your search query or status filter.</p>
        </div>

        <div *ngIf="!loading && filteredJobs.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Position & Applicants</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company & Location</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Level / Type</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Posted Date</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr *ngFor="let job of filteredJobs" class="hover:bg-slate-50/70 transition-colors">
                
                <!-- Title & Applicants -->
                <td class="px-6 py-4">
                  <a [routerLink]="['/jobs', job.id]" class="text-sm font-bold text-slate-900 hover:text-brand-600 transition">
                    {{ job.title }}
                  </a>
                  <p class="text-xs text-slate-500 mt-0.5">
                    {{ job.applicantCount || 0 }} {{ (job.applicantCount === 1) ? 'applicant' : 'applicants' }}
                  </p>
                </td>

                <!-- Company & Location -->
                <td class="px-6 py-4 text-xs">
                  <p class="font-bold text-slate-800">{{ job.companyName }}</p>
                  <p class="text-slate-500 flex items-center gap-1 mt-0.5">
                    <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span>{{ job.location }}</span>
                  </p>
                </td>

                <!-- Level & Type -->
                <td class="px-6 py-4 text-xs text-slate-600">
                  <span class="font-semibold">{{ job.experienceLevel?.replace('_', ' ') }}</span>
                  <span class="block text-slate-500 text-[11px]">{{ job.employmentType?.replace('_', ' ') }}</span>
                  <span 
                    class="mt-1 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border"
                    [ngClass]="{
                      'bg-emerald-50 text-emerald-700 border-emerald-200': job.workplaceType === 'REMOTE',
                      'bg-indigo-50 text-indigo-700 border-indigo-200': job.workplaceType === 'HYBRID',
                      'bg-slate-50 text-slate-700 border-slate-200': !job.workplaceType || job.workplaceType === 'ON_SITE'
                    }"
                  >
                    {{ job.workplaceType === 'REMOTE' ? '🌐 Remote' : (job.workplaceType === 'HYBRID' ? '🔄 Hybrid' : '🏢 On-site') }}
                  </span>
                </td>

                <!-- Status Badge & Toggle -->
                <td class="px-6 py-4">
                  <button
                    (click)="toggleStatus(job)"
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border transition"
                    [ngClass]="job.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'"
                    title="Click to toggle status"
                  >
                    <span class="w-1.5 h-1.5 rounded-full mr-1.5" [ngClass]="job.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                    {{ job.status }} &harr;
                  </button>
                </td>

                <!-- Posted Date -->
                <td class="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                  {{ job.createdAt | date:'MMM d, y' }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-right space-x-2">
                  <a
                    [routerLink]="['/jobs', job.id]"
                    class="px-2.5 py-1 text-xs font-semibold text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-lg transition"
                  >
                    View
                  </a>
                  <button
                    (click)="deleteJob(job)"
                    class="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                    title="Delete job posting"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- Create Global Job Modal -->
      <div *ngIf="showCreateJobModal" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Publish Global Job Offer</h3>
              <p class="text-xs text-slate-500">Post a verified recruitment offer to the platform</p>
            </div>
            <button (click)="showCreateJobModal = false" class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form (ngSubmit)="submitCreateJob()" class="space-y-3.5">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Job Title</label>
              <input
                type="text"
                [(ngModel)]="newJob.title"
                name="title"
                required
                placeholder="e.g. Lead Cloud Architect"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Hiring Company</label>
                <input
                  type="text"
                  [(ngModel)]="newJob.companyName"
                  name="companyName"
                  required
                  placeholder="e.g. Global Tech Partners"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Location</label>
                <input
                  type="text"
                  [(ngModel)]="newJob.location"
                  name="location"
                  required
                  placeholder="e.g. Paris (Hybrid) / Remote"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Employment Type</label>
                <select
                  [(ngModel)]="newJob.employmentType"
                  name="employmentType"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Workplace</label>
                <select
                  [(ngModel)]="newJob.workplaceType"
                  name="workplaceType"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="ON_SITE">🏢 On-site</option>
                  <option value="HYBRID">🔄 Hybrid</option>
                  <option value="REMOTE">🌐 Remote</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Experience Level</label>
                <select
                  [(ngModel)]="newJob.experienceLevel"
                  name="experienceLevel"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="JUNIOR">Junior (0-2 years)</option>
                  <option value="MID_LEVEL">Mid Level (2-5 years)</option>
                  <option value="SENIOR">Senior (5+ years)</option>
                  <option value="LEAD">Lead / Architect</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Required Skills (comma-separated)</label>
              <input
                type="text"
                [(ngModel)]="newJob.requiredSkills"
                name="requiredSkills"
                required
                placeholder="Java, Spring Boot, Docker, PostgreSQL, REST"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Job Description</label>
              <textarea
                [(ngModel)]="newJob.description"
                name="description"
                rows="3"
                required
                placeholder="Detailed position overview, role responsibilities, and qualifications..."
                class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              ></textarea>
            </div>

            <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                (click)="showCreateJobModal = false"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="creatingJob"
                class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50"
              >
                {{ creatingJob ? 'Publishing...' : 'Publish Job Offer' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `
})
export class AdminJobsComponent implements OnInit {
  jobs: JobOffer[] = [];
  loading = true;
  searchQuery = '';
  selectedCity = '';
  selectedStatus = 'ALL';
  selectedWorkplace = 'ALL';

  showCreateJobModal = false;
  creatingJob = false;
  newJob: JobOfferRequest = {
    title: '',
    companyName: '',
    location: '',
    employmentType: 'FULL_TIME',
    workplaceType: 'ON_SITE',
    experienceLevel: 'MID_LEVEL',
    requiredSkills: '',
    description: ''
  };

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    this.adminService.getJobs().subscribe({
      next: (res) => {
        this.jobs = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Failed to load job postings');
      }
    });
  }

  get filteredJobs(): JobOffer[] {
    return this.jobs.filter((job) => {
      const matchesStatus = this.selectedStatus === 'ALL' || job.status === this.selectedStatus;
      const jobWp = job.workplaceType || 'ON_SITE';
      const matchesWorkplace = this.selectedWorkplace === 'ALL' || jobWp === this.selectedWorkplace;

      const cityQuery = this.selectedCity.toLowerCase().trim();
      const matchesCity =
        !cityQuery ||
        cityQuery === 'all' ||
        cityQuery === 'all cities' ||
        (job.location && job.location.toLowerCase().includes(cityQuery));

      const query = this.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.companyName.toLowerCase().includes(query) ||
        (job.location && job.location.toLowerCase().includes(query)) ||
        jobWp.toLowerCase().includes(query) ||
        (jobWp === 'ON_SITE' && (query === 'on-site' || query === 'onsite' || query === 'on site')) ||
        (job.requiredSkills && job.requiredSkills.toLowerCase().includes(query));

      return matchesStatus && matchesWorkplace && matchesCity && matchesSearch;
    });
  }

  toggleStatus(job: JobOffer) {
    this.adminService.toggleJobStatus(job.id).subscribe({
      next: (updated) => {
        job.status = updated.status;
        this.toastService.success(`Job "${job.title}" status changed to ${updated.status}.`, 'Status Updated');
      },
      error: () => {
        this.toastService.error('Failed to update job status');
      }
    });
  }

  openCreateJobModal() {
    this.newJob = {
      title: '',
      companyName: '',
      location: '',
      employmentType: 'FULL_TIME',
      workplaceType: 'ON_SITE',
      experienceLevel: 'MID_LEVEL',
      requiredSkills: '',
      description: ''
    };
    this.showCreateJobModal = true;
  }

  submitCreateJob() {
    if (!this.newJob.title || !this.newJob.companyName || !this.newJob.requiredSkills || !this.newJob.description) {
      this.toastService.error('Please complete all required fields');
      return;
    }

    this.creatingJob = true;
    this.adminService.createJob(this.newJob).subscribe({
      next: (created) => {
        this.creatingJob = false;
        this.showCreateJobModal = false;
        this.toastService.success(`Job "${created.title}" published successfully.`, 'Job Published');
        this.loadJobs();
      },
      error: (err) => {
        this.creatingJob = false;
        this.toastService.error(err.error?.message || 'Failed to publish job offer');
      }
    });
  }

  deleteJob(job: JobOffer) {
    if (!confirm(`Are you sure you want to permanently delete job offer "${job.title}" by "${job.companyName}"? This action cannot be undone.`)) {
      return;
    }

    this.adminService.deleteJob(job.id).subscribe({
      next: () => {
        this.toastService.success(`Job "${job.title}" has been deleted.`, 'Posting Removed');
        this.loadJobs();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Could not delete job posting');
      }
    });
  }
}
