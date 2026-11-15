import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div class="text-center">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/20">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 class="mt-4 text-2xl font-black text-slate-900 tracking-tight">Set New Password</h2>
          <p class="mt-1 text-sm text-slate-500">Choose a new secure password for your HireSmart AI account</p>
        </div>

        <!-- Token Missing Warning -->
        <div *ngIf="!token" class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
          <div class="font-bold">Missing or Invalid Token</div>
          <p>No password reset token was detected in your link. Please request a new password reset email.</p>
          <a routerLink="/auth/login" class="inline-block mt-2 font-bold text-brand-600 hover:underline">
            &larr; Back to Sign In
          </a>
        </div>

        <!-- Success View -->
        <div *ngIf="success" class="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div>
            <h3 class="text-base font-extrabold text-emerald-900">Password Updated!</h3>
            <p class="text-xs text-emerald-700 mt-1">Your password has been changed securely. You can now log in with your new credentials.</p>
          </div>
          <a
            routerLink="/auth/login"
            class="inline-block w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
          >
            Sign In with New Password &rarr;
          </a>
        </div>

        <!-- Reset Form -->
        <form *ngIf="token && !success" [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">New Password</label>
            <input
              type="password"
              formControlName="newPassword"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
            <p *ngIf="resetForm.get('newPassword')?.touched && resetForm.get('newPassword')?.hasError('required')" class="text-xs text-rose-500 mt-1">
              New password is required.
            </p>
            <p *ngIf="resetForm.get('newPassword')?.touched && resetForm.get('newPassword')?.hasError('minlength')" class="text-xs text-rose-500 mt-1">
              Password must be at least 6 characters long.
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
            <p *ngIf="resetForm.get('confirmPassword')?.touched && resetForm.errors?.['mismatch']" class="text-xs text-rose-500 mt-1">
              Passwords do not match.
            </p>
          </div>

          <div *ngIf="errorMessage" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="resetForm.invalid || loading"
            class="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 transition flex items-center justify-center"
          >
            <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Saving New Password...' : 'Save New Password' }}
          </button>
        </form>

        <div class="text-center text-xs text-slate-500">
          Remembered your password?
          <a routerLink="/auth/login" class="font-bold text-brand-600 hover:text-brand-700 ml-1">Sign in here</a>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token = '';
  loading = false;
  success = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const p1 = g.get('newPassword')?.value;
    const p2 = g.get('confirmPassword')?.value;
    return p1 === p2 ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    this.loading = true;
    this.errorMessage = '';

    const newPassword = this.resetForm.value.newPassword;
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.toastService.success('Password has been successfully updated!');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to reset password. The link may have expired.';
        this.toastService.error(this.errorMessage);
      }
    });
  }
}
