import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CandidateService } from '../../core/services/candidate.service';
import { ApplicationService } from '../../core/services/application.service';
import { ToastService } from '../../core/services/toast.service';
import { CandidateProfile } from '../../core/models/candidate.models';
import { Application } from '../../core/models/application.models';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Candidate Portal</h1>
          <p class="text-sm text-slate-500 mt-1">Manage your professional CV and track your submitted job applications</p>
        </div>
        <div class="flex items-center space-x-3">
          <a
            routerLink="/candidate/profile"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-sm"
          >
            Edit Profile
          </a>
          <a
            routerLink="/jobs"
            class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition shadow-sm"
          >
            Browse New Jobs
          </a>
        </div>
      </div>

      <!-- CV Upload & Profile Status Card -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-500/20">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                {{ profile?.firstName }} {{ profile?.lastName }}
                <span *ngIf="profile?.title" class="text-sm font-normal text-slate-500 ml-1">({{ profile?.title }})</span>
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">{{ profile?.email }} &bull; {{ profile?.phone || 'No phone number' }}</p>
              
              <div class="mt-3 flex items-center space-x-3">
                <span *ngIf="profile?.hasCv" class="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <svg class="w-3.5 h-3.5 mr-1 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Active CV: {{ profile?.cvOriginalName }}
                </span>
                <span *ngIf="!profile?.hasCv" class="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  No CV uploaded yet
                </span>

                <button
                  *ngIf="profile?.hasCv"
                  (click)="downloadMyCv()"
                  class="text-xs font-medium text-brand-600 hover:text-brand-800 underline"
                >
                  Download Current CV
                </button>
              </div>
            </div>
          </div>

          <!-- Quick File Upload Trigger -->
          <div class="flex-shrink-0 flex items-center space-x-3">
            <label class="cursor-pointer inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition">
              <svg *ngIf="!uploadingCv" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              <svg *ngIf="uploadingCv" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ uploadingCv ? 'Extracting Text...' : (profile?.hasCv ? 'Upload New CV Version' : 'Upload CV') }}
              <input type="file" accept=".pdf,.doc,.docx,.txt,.rtf,.odt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" (change)="onUploadCv($event)" class="hidden" [disabled]="uploadingCv"/>
            </label>
          </div>
        </div>
      </div>

      <!-- Applications Section -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Submitted Applications</h2>
            <p class="text-xs text-slate-500 mt-0.5">Track recruiter review stages and application status</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {{ applications.length }} Total
          </span>
        </div>

        <div *ngIf="loadingApps" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
          <p class="mt-2 text-sm text-slate-500">Loading your applications...</p>
        </div>

        <div *ngIf="!loadingApps && applications.length === 0" class="text-center py-16">
          <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-sm font-bold text-slate-800">No applications submitted yet</h3>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Explore open jobs and apply to positions matching your competencies.</p>
          <a routerLink="/jobs" class="mt-4 inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition">
            Browse Job Offers
          </a>
        </div>

        <!-- Table -->
        <div *ngIf="!loadingApps && applications.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Job Offer</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Application Status</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Applied Date</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr *ngFor="let app of applications" class="hover:bg-slate-50/80 transition-colors">
                <td class="px-6 py-4">
                  <a [routerLink]="['/jobs', app.jobOfferId]" class="text-sm font-bold text-slate-900 hover:text-brand-600">
                    {{ app.jobTitle }}
                  </a>
                  <p class="text-xs text-slate-400 mt-0.5">CV: {{ app.cvOriginalName || 'Attached Document' }}</p>
                </td>
                <td class="px-6 py-4 text-xs font-medium text-slate-600">
                  {{ app.companyName }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                    [ngClass]="{
                      'bg-blue-50 text-blue-700 border border-blue-200': app.status === 'SUBMITTED',
                      'bg-amber-50 text-amber-700 border border-amber-200': app.status === 'UNDER_REVIEW',
                      'bg-purple-50 text-purple-700 border border-purple-200': app.status === 'INTERVIEW',
                      'bg-emerald-50 text-emerald-700 border border-emerald-200': app.status === 'ACCEPTED',
                      'bg-rose-50 text-rose-700 border border-rose-200': app.status === 'REJECTED'
                    }"
                  >
                    {{ app.status.replace('_', ' ') }}
                  </span>
                </td>
                <td class="px-6 py-4 text-xs text-slate-500">
                  {{ app.createdAt | date:'mediumDate' }}
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    (click)="downloadAppCv(app.id, app.cvOriginalName)"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
                  >
                    CV PDF
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
export class CandidateDashboardComponent implements OnInit {
  profile: CandidateProfile | null = null;
  applications: Application[] = [];
  loadingApps = true;
  uploadingCv = false;

  constructor(
    private candidateService: CandidateService,
    private applicationService: ApplicationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadApplications();
  }

  loadProfile() {
    this.candidateService.getProfile().subscribe({
      next: (data) => this.profile = data,
      error: () => this.toastService.error('Failed to load profile')
    });
  }

  loadApplications() {
    this.loadingApps = true;
    this.candidateService.getMyApplications().subscribe({
      next: (apps) => {
        this.applications = apps;
        this.loadingApps = false;
      },
      error: () => {
        this.loadingApps = false;
        this.toastService.error('Failed to load applications');
      }
    });
  }

  onUploadCv(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const allowed = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowed.includes(ext)) {
      this.toastService.error(`Document format .${ext} is not supported. Allowed formats: ${allowed.join(', ')}`);
      return;
    }

    this.uploadingCv = true;
    this.candidateService.uploadCv(file).subscribe({
      next: (updatedProfile) => {
        this.uploadingCv = false;
        this.profile = updatedProfile;
        this.toastService.success('CV uploaded and text extracted successfully!', 'CV Updated');
      },
      error: (err) => {
        this.uploadingCv = false;
        this.toastService.error(err.error?.message || 'Could not upload CV');
      }
    });
  }

  downloadMyCv() {
    this.candidateService.downloadMyCv().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.profile?.cvOriginalName || 'Candidate_CV.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toastService.error('Could not download CV document')
    });
  }

  downloadAppCv(appId: number, filename?: string) {
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
