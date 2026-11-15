import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../core/services/job.service';
import { RecruiterService } from '../../core/services/recruiter.service';
import { ToastService } from '../../core/services/toast.service';
import { JobOffer, JobStatus } from '../../core/models/job.models';

@Component({
  selector: 'app-recruiter-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Managed Job Offers</h1>
          <p class="text-sm text-slate-500 mt-1">Create, edit, close or reopen recruitment postings</p>
        </div>
        <a
          routerLink="/recruiter/jobs/new"
          class="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition shadow-sm flex items-center"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Post New Job
        </a>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div *ngIf="loading" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
          <p class="mt-2 text-sm text-slate-500">Loading your job offers...</p>
        </div>

        <div *ngIf="!loading && jobs.length === 0" class="text-center py-16">
          <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="text-sm font-bold text-slate-800">No jobs posted yet</h3>
          <p class="text-xs text-slate-500 mt-1">Publish your first job vacancy to start receiving qualified applications.</p>
          <a routerLink="/recruiter/jobs/new" class="mt-4 inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition">
            Create First Job Offer
          </a>
        </div>

        <div *ngIf="!loading && jobs.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type & Level</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Match Threshold</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Applicants</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr *ngFor="let job of jobs" class="hover:bg-slate-50/80 transition-colors">
                <td class="px-6 py-4">
                  <div class="text-sm font-bold text-slate-900">{{ job.title }}</div>
                  <div class="text-xs text-slate-500">{{ job.companyName }} &bull; {{ job.location }}</div>
                </td>
                <td class="px-6 py-4 text-xs text-slate-600 font-medium">
                  <div>{{ job.employmentType.replace('_', ' ') }} &bull; {{ job.experienceLevel.replace('_', ' ') }}</div>
                  <div class="mt-1">
                    <span 
                      class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border"
                      [ngClass]="{
                        'bg-emerald-50 text-emerald-700 border-emerald-200': job.workplaceType === 'REMOTE',
                        'bg-indigo-50 text-indigo-700 border-indigo-200': job.workplaceType === 'HYBRID',
                        'bg-slate-50 text-slate-700 border-slate-200': !job.workplaceType || job.workplaceType === 'ON_SITE'
                      }"
                    >
                      {{ job.workplaceType === 'REMOTE' ? '🌐 Remote' : (job.workplaceType === 'HYBRID' ? '🔄 Hybrid' : '🏢 On-site') }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                    [ngClass]="job.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'"
                  >
                    {{ job.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-1.5">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                      &ge; {{ job.matchThreshold || 70 }}%
                    </span>
                    <button
                      (click)="cycleThreshold(job)"
                      title="Adjust match threshold percentage"
                      class="px-2 py-0.5 rounded text-[11px] font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition"
                    >
                      Cycle &plus;
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <a
                    [routerLink]="['/recruiter/jobs', job.id, 'applications']"
                    class="inline-flex items-center text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200"
                  >
                    {{ job.applicantCount || 0 }} Candidates &rarr;
                  </a>
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <!-- Toggle Status -->
                  <button
                    (click)="toggleStatus(job)"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-medium border transition"
                    [ngClass]="job.status === 'ACTIVE' ? 'text-amber-700 border-amber-200 hover:bg-amber-50' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'"
                  >
                    {{ job.status === 'ACTIVE' ? 'Close Job' : 'Reopen Job' }}
                  </button>

                  <!-- Edit -->
                  <a
                    [routerLink]="['/recruiter/jobs', job.id, 'edit']"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
                  >
                    Edit
                  </a>

                  <!-- Delete -->
                  <button
                    (click)="deleteJob(job.id)"
                    class="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class RecruiterJobsComponent implements OnInit {
  jobs: JobOffer[] = [];
  loading = true;

  constructor(
    private recruiterService: RecruiterService,
    private jobService: JobService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    this.recruiterService.getMyJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Failed to load your job postings');
      }
    });
  }

  toggleStatus(job: JobOffer) {
    const nextStatus: JobStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    this.jobService.updateJobStatus(job.id, nextStatus).subscribe({
      next: () => {
        this.toastService.success(`Job marked as ${nextStatus}`, 'Status Updated');
        this.loadJobs();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Could not update status');
      }
    });
  }

  cycleThreshold(job: JobOffer) {
    const thresholds = [50, 60, 70, 75, 80, 85, 90];
    const current = job.matchThreshold || 70;
    let nextIdx = (thresholds.indexOf(current) + 1) % thresholds.length;
    if (nextIdx === -1) nextIdx = 0;
    const nextVal = thresholds[nextIdx];

    this.jobService.updateJobThreshold(job.id, nextVal).subscribe({
      next: (updated) => {
        job.matchThreshold = updated.matchThreshold;
        this.toastService.success(`Match threshold for "${job.title}" set to ${updated.matchThreshold}%.`, 'Threshold Updated');
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Could not update threshold');
      }
    });
  }

  deleteJob(id: number) {
    if (!confirm('Are you sure you want to delete this job offer?')) return;

    this.jobService.deleteJob(id).subscribe({
      next: () => {
        this.toastService.success('Job offer deleted successfully', 'Deleted');
        this.loadJobs();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Could not delete job');
      }
    });
  }
}
