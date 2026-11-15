import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecruiterService } from '../../core/services/recruiter.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { RecruiterProfile } from '../../core/models/recruiter.models';

@Component({
  selector: 'app-recruiter-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Recruiter Settings</h1>
          <p class="text-xs text-slate-500 mt-0.5">Manage your hiring organization profile and account security credentials</p>
        </div>
        <a routerLink="/recruiter/dashboard" class="text-xs font-semibold text-purple-600 hover:text-purple-800">
          &larr; Back to Dashboard
        </a>
      </div>

      <!-- Tab Navigation -->
      <div class="flex items-center space-x-2 border-b border-slate-200 pb-1">
        <button
          type="button"
          (click)="activeTab = 'profile'"
          class="flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
          [ngClass]="activeTab === 'profile' ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          Company Profile
        </button>

        <button
          type="button"
          (click)="activeTab = 'security'"
          class="flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
          [ngClass]="activeTab === 'security' ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          Change Password
        </button>
      </div>

      <!-- TAB 1: Company Profile -->
      <div *ngIf="activeTab === 'profile'" class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <form [formGroup]="profileForm" (ngSubmit)="onSaveProfile()" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company / Organization Name</label>
            <input
              type="text"
              formControlName="companyName"
              placeholder="e.g. Capgemini Morocco, Renault Group"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p *ngIf="profileForm.get('companyName')?.touched && profileForm.get('companyName')?.invalid" class="text-xs text-rose-500 mt-1">
              Company name is required.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Headquarters / Location</label>
              <input
                type="text"
                formControlName="location"
                placeholder="e.g. Casablanca, Rabat, Tangier"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Official Website</label>
              <input
                type="text"
                formControlName="website"
                placeholder="e.g. https://www.company.ma"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company Overview & Mission</label>
            <textarea
              formControlName="companyDescription"
              rows="4"
              placeholder="Describe your organization, industry footprint, culture, and core focus..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <div class="pt-4 flex justify-end">
            <button
              type="submit"
              [disabled]="profileForm.invalid || savingProfile"
              class="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition shadow-sm flex items-center"
            >
              <svg *ngIf="savingProfile" class="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ savingProfile ? 'Saving...' : 'Save Company Details' }}
            </button>
          </div>
        </form>
      </div>

      <!-- TAB 2: Change Password / Security -->
      <div *ngIf="activeTab === 'security'" class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Recruiter Account Security</h2>
          <p class="text-xs text-slate-500 mt-0.5">Ensure your organization's hiring portal remains protected by updating your credentials.</p>
        </div>

        <form [formGroup]="securityForm" (ngSubmit)="onChangePassword()" class="space-y-5 max-w-lg">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Current Password</label>
            <input
              type="password"
              formControlName="currentPassword"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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
              class="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition shadow-sm flex items-center"
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
export class RecruiterProfileComponent implements OnInit {
  activeTab: 'profile' | 'security' = 'profile';

  profileForm: FormGroup;
  securityForm: FormGroup;
  profile: RecruiterProfile | null = null;
  savingProfile = false;

  changePasswordLoading = false;
  changePasswordSuccess = false;
  changePasswordError = '';

  constructor(
    private fb: FormBuilder,
    private recruiterService: RecruiterService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.profileForm = this.fb.group({
      companyName: ['', [Validators.required]],
      location: [''],
      website: [''],
      companyDescription: ['']
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

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.recruiterService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          companyName: profile.companyName,
          location: profile.location || '',
          website: profile.website || '',
          companyDescription: profile.companyDescription || ''
        });
      },
      error: (err) => {
        console.warn('Could not load recruiter profile:', err);
      }
    });
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid) return;

    this.savingProfile = true;
    this.recruiterService.updateProfile(this.profileForm.value).subscribe({
      next: (updated) => {
        this.savingProfile = false;
        this.profile = updated;
        this.toastService.success('Company profile updated successfully!');
      },
      error: (err) => {
        this.savingProfile = false;
        this.toastService.error(err.error?.message || 'Failed to update profile.');
      }
    });
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
}
