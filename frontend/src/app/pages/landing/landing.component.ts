import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { JobService } from '../../core/services/job.service';
import { JobOffer } from '../../core/models/job.models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="relative overflow-hidden">
      <!-- Gradient Hero Background -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))] pointer-events-none"></div>
      
      <!-- Hero Section -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <h1 class="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto">
          Next-Gen Recruitment Powered by <span class="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Artificial Intelligence</span>
        </h1>

        <p class="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Streamline your hiring journey with HireSmart AI — combining intelligent CV analysis, transparent skill compatibility matching, and modern recruitment tools to connect top talent with the right opportunities.
        </p>

        <!-- CTA Buttons -->
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            routerLink="/jobs"
            (click)="goToJobs($event)"
            class="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-center cursor-pointer select-none"
          >
            Explore Active Job Offers
          </a>
          <!-- When NOT logged in: Show Join button -->
          <a
            *ngIf="!authService.isAuthenticated()"
            routerLink="/auth/register"
            class="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-brand-600 shadow-sm transition-all text-center cursor-pointer select-none"
          >
            Join as Recruiter / Candidate
          </a>
          <!-- When logged in: Show Go to Dashboard -->
          <a
            *ngIf="authService.isAuthenticated()"
            [routerLink]="getDashboardRoute()"
            class="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-brand-600 shadow-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            <span>Go to My Dashboard</span>
            <svg class="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Recent Jobs Preview -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200/60">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Recent Jobs</h2>
            </div>
            <p class="text-sm text-slate-500 mt-1">Explore the latest open opportunities on the platform</p>
          </div>
          <a
            routerLink="/jobs"
            (click)="goToJobs($event)"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 hover:text-brand-800 border border-brand-200 transition-all shadow-xs cursor-pointer select-none group w-fit"
          >
            <span>View all jobs</span>
            <svg class="w-4 h-4 text-brand-600 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        <div *ngIf="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
          <p class="mt-2 text-sm text-slate-500">Loading open positions...</p>
        </div>

        <div *ngIf="!loading && jobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let job of jobs.slice(0, 3)"
            (click)="goToJob(job.id, $event)"
            class="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-brand-300 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div class="flex items-start justify-between">
                <div>
                  <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 mb-2">
                    {{ job.employmentType.replace('_', ' ') }}
                  </span>
                  <h3 class="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {{ job.title }}
                  </h3>
                  <p class="text-sm font-medium text-slate-600 mt-0.5">{{ job.companyName }} &bull; {{ job.location }}</p>
                </div>
              </div>

              <p class="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {{ job.description }}
              </p>

              <div class="mt-4 flex flex-wrap gap-1.5">
                <span *ngFor="let skill of splitSkills(job.requiredSkills)" class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                  {{ skill }}
                </span>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span class="text-xs text-slate-600 font-semibold">{{ job.experienceLevel.replace('_', ' ') }}</span>
              <a
                [routerLink]="['/jobs', job.id]"
                (click)="goToJob(job.id, $event)"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow transition-all cursor-pointer select-none group-hover:bg-brand-700"
              >
                <span>View & Apply</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LandingComponent implements OnInit {
  jobs: JobOffer[] = [];
  loading = true;

  constructor(
    private jobService: JobService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.jobService.getAllJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  splitSkills(skills: string): string[] {
    if (!skills) return [];
    return skills.split(',').map(s => s.trim()).slice(0, 4);
  }

  getDashboardRoute(): string {
    const role = this.authService.getUserRole();
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'RECRUITER') return '/recruiter/dashboard';
    return '/candidate/dashboard';
  }

  goToJobs(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.router.navigate(['/jobs']);
  }

  goToJob(jobId: number, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.router.navigate(['/jobs', jobId]);
  }
}
