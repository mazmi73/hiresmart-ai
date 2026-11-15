import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../core/services/job.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-recruiter-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">
            {{ isEditMode ? 'Edit Job Offer' : 'Create New Job Offer' }}
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">Specify job requirements, details, and required skills for AI matching</p>
        </div>
        <a routerLink="/recruiter/jobs" class="text-xs font-semibold text-brand-600 hover:text-brand-800">
          &larr; Back to Jobs
        </a>
      </div>

      <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <form [formGroup]="jobForm" (ngSubmit)="onSubmit()" class="space-y-5">
          
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Job Title</label>
            <input
              type="text"
              formControlName="title"
              placeholder="e.g. Business Development Manager, Project Manager, or Software Engineer"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company Name</label>
              <input
                type="text"
                formControlName="companyName"
                placeholder="e.g. Attijariwafa Bank, Marjane Group, or Capgemini"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Location</label>
              <input
                type="text"
                formControlName="location"
                placeholder="Casablanca, Morocco (Hybrid)"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Employment Type</label>
              <select
                formControlName="employmentType"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
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
                formControlName="workplaceType"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white font-medium"
              >
                <option value="ON_SITE">🏢 On-site</option>
                <option value="HYBRID">🔄 Hybrid</option>
                <option value="REMOTE">🌐 Remote</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Experience Level</label>
              <select
                formControlName="experienceLevel"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="JUNIOR">Junior</option>
                <option value="MID_LEVEL">Mid Level</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead / Architect</option>
              </select>
            </div>
          </div>

          <!-- Required Skills with Autosuggestion and Quick Chips -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Required Skills & Competencies (comma-separated)
              </label>
              <span *ngIf="allDatabaseSkills.length > 0" class="text-[11px] text-slate-500 font-medium">
                Autosuggest active &bull; {{ allDatabaseSkills.length }} skills indexed
              </span>
            </div>

            <div class="relative">
              <input
                type="text"
                formControlName="requiredSkills"
                (input)="onSkillsInput($event)"
                (keydown)="onSkillsKeydown($event)"
                (focus)="onSkillsFocus()"
                (blur)="onSkillsBlur()"
                autocomplete="off"
                placeholder="e.g. B2B Sales, CRM, Project Management, Negotiation, or Python"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 pr-10"
              />

              <!-- Sparkle Search Icon -->
              <div class="absolute right-3 top-3 pointer-events-none text-slate-400">
                <svg class="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>

              <!-- Autosuggestion Floating Dropdown -->
              <div
                *ngIf="showSuggestions && filteredSuggestions.length > 0"
                class="absolute left-0 right-0 z-50 mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto"
              >
                <div class="px-3.5 py-1.5 bg-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Suggested from database ({{ filteredSuggestions.length }})</span>
                  <span class="text-[10px] font-normal text-slate-400 lowercase">&uarr;&darr; navigate, Enter to pick</span>
                </div>
                <div
                  *ngFor="let suggestion of filteredSuggestions; let i = index"
                  (mousedown)="selectSuggestedSkill(suggestion, $event)"
                  [ngClass]="activeSuggestionIndex === i ? 'bg-brand-50 text-brand-800 font-bold' : 'text-slate-700 hover:bg-slate-50'"
                  class="px-3.5 py-2.5 text-xs flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 rounded-full bg-brand-500"></span>
                    <span>{{ suggestion }}</span>
                  </div>
                  <span class="text-[10px] text-brand-600 bg-brand-50 hover:bg-brand-100 px-2 py-0.5 rounded border border-brand-200 font-semibold">
                    + Add
                  </span>
                </div>
              </div>
            </div>

            <p class="text-[11px] text-slate-400 mt-1.5">
              Click common skills below to quickly append them to the job requirements:
            </p>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <button
                *ngFor="let quickSkill of sampleSkills"
                type="button"
                (click)="appendSkill(quickSkill)"
                class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 border border-slate-200 transition"
              >
                + {{ quickSkill }}
              </button>
            </div>
          </div>

          <!-- High Compatibility Match Threshold (%) -->
          <div class="bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-indigo-50/50 border border-emerald-200/90 rounded-2xl p-5 space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>High Compatibility Match Threshold (%)</span>
              </label>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
                {{ jobForm.get('matchThreshold')?.value || 70 }}% Overlap
              </span>
            </div>

            <input
              type="range"
              min="40"
              max="95"
              step="5"
              formControlName="matchThreshold"
              class="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div class="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>40% (Lenient)</span>
              <div class="space-x-1.5">
                <button
                  type="button"
                  (click)="jobForm.patchValue({ matchThreshold: 50 })"
                  class="px-2 py-0.5 rounded text-[10px] font-bold border transition"
                  [ngClass]="jobForm.get('matchThreshold')?.value === 50 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
                >
                  50%
                </button>
                <button
                  type="button"
                  (click)="jobForm.patchValue({ matchThreshold: 70 })"
                  class="px-2 py-0.5 rounded text-[10px] font-bold border transition"
                  [ngClass]="jobForm.get('matchThreshold')?.value === 70 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
                >
                  70% (Balanced)
                </button>
                <button
                  type="button"
                  (click)="jobForm.patchValue({ matchThreshold: 85 })"
                  class="px-2 py-0.5 rounded text-[10px] font-bold border transition"
                  [ngClass]="jobForm.get('matchThreshold')?.value === 85 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
                >
                  85% (Strict)
                </button>
              </div>
              <span>95% (Strict)</span>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed">
              Applicants whose AI match score meets or exceeds this threshold will be highlighted with a <strong class="text-emerald-700">High Match</strong> badge in your candidate pipeline.
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Detailed Description</label>
            <textarea
              formControlName="description"
              rows="6"
              placeholder="Describe position responsibilities, team environment, and day-to-day expectations..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <a
              routerLink="/recruiter/jobs"
              class="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </a>
            <button
              type="submit"
              [disabled]="jobForm.invalid || submitting"
              class="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition shadow-sm"
            >
              {{ submitting ? 'Saving...' : (isEditMode ? 'Update Job Offer' : 'Publish Job Offer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RecruiterJobFormComponent implements OnInit {
  jobForm: FormGroup;
  isEditMode = false;
  jobId: number | null = null;
  submitting = false;

  allDatabaseSkills: string[] = [];
  filteredSuggestions: string[] = [];
  showSuggestions = false;
  activeSuggestionIndex = 0;

  sampleSkills = [
    'B2B Sales', 'Business Development', 'Project Management', 'Financial Analysis',
    'Customer Service', 'CRM', 'English Fluency', 'Negotiation', 'Team Leadership',
    'Supply Chain', 'Digital Marketing', 'Data Analysis', 'Risk Management',
    'Java', 'Spring Boot', 'Angular', 'Docker', 'PostgreSQL', 'Python'
  ];

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      companyName: ['', Validators.required],
      location: ['', Validators.required],
      employmentType: ['FULL_TIME', Validators.required],
      workplaceType: ['ON_SITE', Validators.required],
      experienceLevel: ['MID_LEVEL', Validators.required],
      requiredSkills: ['', Validators.required],
      description: ['', Validators.required],
      matchThreshold: [70, [Validators.required, Validators.min(10), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.loadDatabaseSkills();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = Number(id);
      this.jobService.getJobById(this.jobId).subscribe({
        next: (job) => {
          const user = this.authService.getCurrentUser();
          if (user && job.recruiterId !== user.id) {
            this.toastService.error('You are not authorized to edit this job posting');
            this.router.navigate(['/recruiter/jobs']);
            return;
          }
          this.jobForm.patchValue({
            title: job.title,
            companyName: job.companyName,
            location: job.location,
            employmentType: job.employmentType,
            workplaceType: job.workplaceType || 'ON_SITE',
            experienceLevel: job.experienceLevel,
            requiredSkills: job.requiredSkills,
            description: job.description,
            matchThreshold: job.matchThreshold != null ? job.matchThreshold : 70
          });
        },
        error: () => {
          this.toastService.error('Job offer not found');
          this.router.navigate(['/recruiter/jobs']);
        }
      });
    }
  }

  loadDatabaseSkills(): void {
    this.jobService.getSkills().subscribe({
      next: (skills) => {
        this.allDatabaseSkills = skills;
      },
      error: (err) => {
        console.warn('Could not load database skills:', err);
      }
    });
  }

  onSkillsInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.updateSuggestions(input.value);
  }

  onSkillsFocus(): void {
    const val = this.jobForm.get('requiredSkills')?.value || '';
    this.updateSuggestions(val);
  }

  onSkillsBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  onSkillsKeydown(event: KeyboardEvent): void {
    if (!this.showSuggestions || this.filteredSuggestions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeSuggestionIndex = (this.activeSuggestionIndex + 1) % this.filteredSuggestions.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeSuggestionIndex = (this.activeSuggestionIndex - 1 + this.filteredSuggestions.length) % this.filteredSuggestions.length;
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      if (this.activeSuggestionIndex >= 0 && this.activeSuggestionIndex < this.filteredSuggestions.length) {
        event.preventDefault();
        this.selectSuggestedSkill(this.filteredSuggestions[this.activeSuggestionIndex]);
      }
    } else if (event.key === 'Escape') {
      this.showSuggestions = false;
    }
  }

  private updateSuggestions(currentValue: string): void {
    if (!currentValue) {
      this.showSuggestions = false;
      this.filteredSuggestions = [];
      return;
    }

    const tokens = currentValue.split(',');
    const currentToken = tokens[tokens.length - 1].trim();

    if (currentToken.length === 0) {
      this.showSuggestions = false;
      this.filteredSuggestions = [];
      return;
    }

    const lowerToken = currentToken.toLowerCase();
    const existing = new Set(
      tokens.slice(0, tokens.length - 1).map(s => s.trim().toLowerCase())
    );

    const startsWithMatches: string[] = [];
    const containsMatches: string[] = [];

    for (const skill of this.allDatabaseSkills) {
      const lowerSkill = skill.toLowerCase();
      if (existing.has(lowerSkill)) {
        continue;
      }
      if (lowerSkill.startsWith(lowerToken)) {
        startsWithMatches.push(skill);
      } else if (lowerSkill.includes(lowerToken)) {
        containsMatches.push(skill);
      }
    }

    this.filteredSuggestions = [...startsWithMatches, ...containsMatches].slice(0, 8);
    this.showSuggestions = this.filteredSuggestions.length > 0;
    this.activeSuggestionIndex = 0;
  }

  selectSuggestedSkill(skill: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const currentVal = this.jobForm.get('requiredSkills')?.value || '';
    const parts = currentVal.split(',');
    if (parts.length > 0) {
      parts[parts.length - 1] = ' ' + skill.trim();
    } else {
      parts.push(skill.trim());
    }

    const clean = parts.map(p => p.trim()).filter(p => p.length > 0);
    this.jobForm.patchValue({
      requiredSkills: clean.join(', ') + ', '
    });

    this.showSuggestions = false;
    this.filteredSuggestions = [];
  }

  appendSkill(skill: string) {
    const current = this.jobForm.get('requiredSkills')?.value || '';
    const skillsList = current.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    if (!skillsList.includes(skill)) {
      skillsList.push(skill);
      this.jobForm.patchValue({
        requiredSkills: skillsList.join(', ') + ', '
      });
    }
  }

  onSubmit() {
    if (this.jobForm.invalid) return;

    this.submitting = true;

    // Clean trailing commas and spaces before saving
    const rawSkills = this.jobForm.get('requiredSkills')?.value || '';
    const cleanSkills = rawSkills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0).join(', ');
    this.jobForm.patchValue({ requiredSkills: cleanSkills });

    if (this.isEditMode && this.jobId) {
      this.jobService.updateJob(this.jobId, this.jobForm.value).subscribe({
        next: () => {
          this.submitting = false;
          this.toastService.success('Job offer updated successfully', 'Saved');
          this.router.navigate(['/recruiter/jobs']);
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Could not update job offer');
        }
      });
    } else {
      this.jobService.createJob(this.jobForm.value).subscribe({
        next: () => {
          this.submitting = false;
          this.toastService.success('Job offer published successfully', 'Published');
          this.router.navigate(['/recruiter/jobs']);
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.error(err.error?.message || 'Could not create job offer');
        }
      });
    }
  }
}
