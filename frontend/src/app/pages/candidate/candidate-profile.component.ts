import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CandidateService } from '../../core/services/candidate.service';
import { JobService } from '../../core/services/job.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { CandidateProfile } from '../../core/models/candidate.models';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
          <p class="text-xs text-slate-500 mt-0.5">Manage your professional candidate profile, CV document, and account security</p>
        </div>
        <a routerLink="/candidate/dashboard" class="text-xs font-semibold text-brand-600 hover:text-brand-800">
          &larr; Back to Dashboard
        </a>
      </div>

      <!-- Tab Navigation -->
      <div class="flex items-center space-x-2 border-b border-slate-200 pb-1">
        <button
          type="button"
          (click)="activeTab = 'profile'"
          class="flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
          [ngClass]="activeTab === 'profile' ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Profile & CV
        </button>

        <button
          type="button"
          (click)="activeTab = 'security'"
          class="flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
          [ngClass]="activeTab === 'security' ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          Change Password
        </button>
      </div>

      <!-- TAB 1: Profile & CV -->
      <div *ngIf="activeTab === 'profile'" class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">First Name</label>
              <input
                type="text"
                formControlName="firstName"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Last Name</label>
              <input
                type="text"
                formControlName="lastName"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
              <input
                type="text"
                formControlName="phone"
                placeholder="+212 6 12 34 56 78"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Professional Title</label>
              <input
                type="text"
                formControlName="title"
                placeholder="e.g. Sales Specialist, Project Manager, Software Engineer"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Education & Degrees</label>
            <input
              type="text"
              formControlName="education"
              placeholder="e.g. Master in Management, Business Administration, or Engineering"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Experience Summary</label>
            <textarea
              formControlName="experienceSummary"
              rows="3"
              placeholder="Brief summary of your professional journey and key achievements..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          <!-- Self-Reported Skills with Autosuggestion and Quick Chips -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Self-Reported Skills (comma-separated)
              </label>
              <span *ngIf="allDatabaseSkills.length > 0" class="text-[11px] text-slate-500 font-medium">
                Autosuggest active &bull; {{ allDatabaseSkills.length }} skills indexed
              </span>
            </div>

            <div class="relative">
              <input
                type="text"
                formControlName="skills"
                (input)="onSkillsInput($event)"
                (keydown)="onSkillsKeydown($event)"
                (focus)="onSkillsFocus()"
                (blur)="onSkillsBlur()"
                autocomplete="off"
                placeholder="e.g. Customer Relationship Management, B2B Sales, Project Management, Python"
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
              Click common skills below to quickly append them to your profile:
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

          <!-- Curriculum Vitae (CV) Section -->
          <div class="pt-5 border-t border-slate-100 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Curriculum Vitae (PDF)</label>
                <p class="text-xs text-slate-500 mt-0.5">Your CV is analyzed by AI to compute match scores for job opportunities</p>
              </div>
              <span *ngIf="profile?.hasCv" class="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <svg class="w-3.5 h-3.5 mr-1 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Active CV
              </span>
            </div>

            <!-- When CV exists -->
            <div *ngIf="profile?.hasCv" class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center space-x-3 min-w-0">
                <div class="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-sm">
                  PDF
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-bold text-slate-800 truncate">{{ profile?.cvOriginalName || 'Uploaded_CV.pdf' }}</p>
                  <p class="text-xs text-slate-500">Document analyzed &bull; Ready for job applications</p>
                </div>
              </div>
              <div class="flex items-center space-x-2.5 flex-shrink-0">
                <button
                  type="button"
                  (click)="downloadMyCv()"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition shadow-sm inline-flex items-center"
                >
                  <svg class="w-3.5 h-3.5 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download CV
                </button>
                <label class="cursor-pointer px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm inline-flex items-center" [class.opacity-50]="uploadingCv">
                  <svg *ngIf="!uploadingCv" class="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  <svg *ngIf="uploadingCv" class="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ uploadingCv ? 'Uploading...' : 'Replace CV' }}
                  <input type="file" accept=".pdf,.doc,.docx,.txt,.rtf,.odt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" (change)="onUploadCv($event)" class="hidden" [disabled]="uploadingCv"/>
                </label>
              </div>
            </div>

            <!-- When no CV uploaded yet -->
            <div *ngIf="!profile?.hasCv" class="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition">
              <div class="mx-auto w-10 h-10 text-slate-400 mb-2">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
              <p class="text-sm font-bold text-slate-700">No CV attached to your profile yet</p>
              <p class="text-xs text-slate-500 mt-0.5 mb-3">Upload your CV in PDF, Word, or Text format (up to 10MB) for AI skill matching</p>
              <label class="cursor-pointer inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition shadow-sm" [class.opacity-50]="uploadingCv">
                <svg *ngIf="!uploadingCv" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                <svg *ngIf="uploadingCv" class="animate-spin -ml-0.5 mr-1.5 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ uploadingCv ? 'Extracting text...' : 'Upload CV' }}
                <input type="file" accept=".pdf,.doc,.docx,.txt,.rtf,.odt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" (change)="onUploadCv($event)" class="hidden" [disabled]="uploadingCv"/>
              </label>
            </div>
          </div>

          <div class="pt-4 flex justify-end">
            <button
              type="submit"
              [disabled]="profileForm.invalid || saving"
              class="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition shadow-sm"
            >
              {{ saving ? 'Saving Changes...' : 'Save Profile Changes' }}
            </button>
          </div>
        </form>
      </div>

      <!-- TAB 2: Change Password / Security -->
      <div *ngIf="activeTab === 'security'" class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Account Password & Security</h2>
          <p class="text-xs text-slate-500 mt-0.5">Ensure your candidate account remains safe by updating your password regularly.</p>
        </div>

        <form [formGroup]="securityForm" (ngSubmit)="onChangePassword()" class="space-y-5 max-w-lg">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Current Password</label>
            <input
              type="password"
              formControlName="currentPassword"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            <p *ngIf="securityForm.get('currentPassword')?.touched && securityForm.get('currentPassword')?.invalid" class="text-xs text-rose-500 mt-1">
              Current password is required.
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">New Password</label>
            <input
              type="password"
              formControlName="newPassword"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            <p *ngIf="securityForm.get('newPassword')?.touched && securityForm.get('newPassword')?.hasError('minlength')" class="text-xs text-rose-500 mt-1">
              New password must be at least 6 characters long.
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Confirm New Password</label>
            <input
              type="password"
              formControlName="confirmPassword"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            <p *ngIf="securityForm.get('confirmPassword')?.touched && securityForm.errors?.['mismatch']" class="text-xs text-rose-500 mt-1">
              Passwords do not match.
            </p>
          </div>

          <!-- Alert for Error -->
          <div *ngIf="changePasswordError" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
            <svg class="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 1118 0z"/>
            </svg>
            <span>{{ changePasswordError }}</span>
          </div>

          <!-- Alert for Success -->
          <div *ngIf="changePasswordSuccess" class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center space-x-2">
            <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>Your password has been changed successfully!</span>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              [disabled]="securityForm.invalid || changePasswordLoading"
              class="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition shadow-sm flex items-center"
            >
              <svg *ngIf="changePasswordLoading" class="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ changePasswordLoading ? 'Updating Password...' : 'Update Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CandidateProfileComponent implements OnInit {
  activeTab: 'profile' | 'security' = 'profile';

  profileForm: FormGroup;
  securityForm: FormGroup;
  profile: CandidateProfile | null = null;
  saving = false;
  uploadingCv = false;

  changePasswordLoading = false;
  changePasswordSuccess = false;
  changePasswordError = '';

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
    private candidateService: CandidateService,
    private jobService: JobService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: [''],
      title: [''],
      education: [''],
      experienceSummary: [''],
      skills: ['']
    });

    this.securityForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    const p1 = g.get('newPassword')?.value;
    const p2 = g.get('confirmPassword')?.value;
    return p1 === p2 ? null : { mismatch: true };
  }

  onChangePassword(): void {
    if (this.securityForm.invalid) return;

    this.changePasswordLoading = true;
    this.changePasswordError = '';
    this.changePasswordSuccess = false;

    const { currentPassword, newPassword } = this.securityForm.value;
    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.changePasswordLoading = false;
        this.changePasswordSuccess = true;
        this.securityForm.reset();
        this.toastService.success('Password updated successfully!');
      },
      error: (err) => {
        this.changePasswordLoading = false;
        this.changePasswordError = err.error?.message || 'Failed to update password. Please check your current password.';
        this.toastService.error(this.changePasswordError);
      }
    });
  }

  ngOnInit(): void {
    this.loadDatabaseSkills();

    this.candidateService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          title: profile.title,
          education: profile.education,
          experienceSummary: profile.experienceSummary,
          skills: profile.skills
        });
      }
    });
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
    const val = this.profileForm.get('skills')?.value || '';
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

    const currentVal = this.profileForm.get('skills')?.value || '';
    const parts = currentVal.split(',');
    if (parts.length > 0) {
      parts[parts.length - 1] = ' ' + skill.trim();
    } else {
      parts.push(skill.trim());
    }

    const clean = parts.map(p => p.trim()).filter(p => p.length > 0);
    this.profileForm.patchValue({
      skills: clean.join(', ') + ', '
    });

    this.showSuggestions = false;
    this.filteredSuggestions = [];
  }

  appendSkill(skill: string) {
    const current = this.profileForm.get('skills')?.value || '';
    const skillsList = current.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    if (!skillsList.includes(skill)) {
      skillsList.push(skill);
      this.profileForm.patchValue({
        skills: skillsList.join(', ') + ', '
      });
    }
  }

  onUploadCv(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowed = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowed.includes(ext)) {
      this.toastService.error(`Document format .${ext} is not supported. Allowed formats: ${allowed.join(', ')}`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.toastService.error('CV file size exceeds 10MB limit');
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

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.saving = true;

    // Clean trailing commas and spaces before saving
    const rawSkills = this.profileForm.get('skills')?.value || '';
    const cleanSkills = rawSkills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0).join(', ');
    this.profileForm.patchValue({ skills: cleanSkills });

    this.candidateService.updateProfile(this.profileForm.value).subscribe({
      next: (updated) => {
        this.saving = false;
        this.profile = updated;
        this.toastService.success('Your profile has been updated.', 'Saved');
      },
      error: (err) => {
        this.saving = false;
        this.toastService.error(err.error?.message || 'Could not update profile');
      }
    });
  }
}
