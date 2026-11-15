import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div class="text-center">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/20">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
          </div>
          <h2 class="mt-4 text-2xl font-black text-slate-900 tracking-tight">Welcome to HireSmart AI</h2>
          <p class="mt-1 text-sm text-slate-500">Sign in to your intelligent recruitment workspace</p>
        </div>

        <!-- One-Click Demonstration Instant Sign-In -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
          <div class="flex items-center justify-between text-xs font-bold text-slate-700">
            <span class="flex items-center">
              <span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              One-Click Demo Sign-In:
            </span>
            <span class="text-[11px] text-slate-600 font-medium">Click to instantly log in</span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <!-- Admin Demo Button -->
            <button
              type="button"
              (click)="quickLogin('admin@hiresmart.ai', 'Admin123!')"
              [disabled]="loading"
              class="px-2.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition-all flex flex-col items-center justify-center disabled:opacity-50"
            >
              <span>Admin Demo</span>
              <span class="text-[9px] font-normal opacity-90">admin&#64;hiresmart.ai</span>
            </button>

            <!-- Recruiter Demo Button (Capgemini Morocco) -->
            <button
              type="button"
              (click)="quickLogin('capgemini@gmail.com', 'Recruiter123!')"
              [disabled]="loading"
              class="px-2.5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow transition-all flex flex-col items-center justify-center disabled:opacity-50"
            >
              <span>Recruiter Demo</span>
              <span class="text-[9px] font-normal opacity-90 truncate max-w-full">Capgemini Morocco</span>
            </button>

            <!-- Candidate Demo Button (Youssef Benali) -->
            <button
              type="button"
              (click)="quickLogin('youssef.benali@candidates.ma', 'Candidate123!')"
              [disabled]="loading"
              class="px-2.5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow transition-all flex flex-col items-center justify-center disabled:opacity-50"
            >
              <span>Candidate Demo</span>
              <span class="text-[9px] font-normal opacity-90 truncate max-w-full">Youssef Benali</span>
            </button>
          </div>

          <!-- Quick switcher for other new Moroccan Profiles -->
          <div class="pt-2 border-t border-slate-200/80">
            <div class="flex items-center justify-between text-[10px] text-slate-500 mb-1.5 font-bold uppercase tracking-wider">
              <span>More Moroccan Profiles:</span>
            </div>
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                (click)="quickLogin('renault@hiresmart.ma', 'Recruiter123!')"
                class="px-2 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-[10px] font-semibold text-slate-700 transition"
                title="Renault Group Morocco"
              >
                Renault (Recruiter)
              </button>
              <button
                type="button"
                (click)="quickLogin('marjane@hiresmart.ma', 'Recruiter123!')"
                class="px-2 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-[10px] font-semibold text-slate-700 transition"
                title="Marjane Group Retail"
              >
                Marjane (Recruiter)
              </button>
              <button
                type="button"
                (click)="quickLogin('amine.elidrissi@candidates.ma', 'Candidate123!')"
                class="px-2 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-[10px] font-semibold text-slate-700 transition"
                title="Amine El Idrissi (Fullstack Developer - 100% High Match)"
              >
                Amine (Candidate)
              </button>
              <button
                type="button"
                (click)="quickLogin('fatima.mansouri@candidates.ma', 'Candidate123!')"
                class="px-2 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-[10px] font-semibold text-slate-700 transition"
                title="Fatima Mansouri (Automotive Quality - 100% High Match)"
              >
                Fatima (Candidate)
              </button>
            </div>
          </div>
        </div>

        <div class="relative flex py-1 items-center">
          <div class="flex-grow border-t border-slate-200"></div>
          <span class="flex-shrink mx-3 text-xs text-slate-600 font-semibold uppercase">Or Sign In Manually</span>
          <div class="flex-grow border-t border-slate-200"></div>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              formControlName="email"
              placeholder="admin@hiresmart.ai"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            />
            <p *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="text-xs text-rose-500 mt-1">
              Please provide a valid email address.
            </p>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <button
                type="button"
                (click)="openForgotModal()"
                class="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              formControlName="password"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
            />
            <p *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="text-xs text-rose-500 mt-1">
              Password is required.
            </p>
          </div>

          <div *ngIf="errorMessage" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || loading"
            class="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 transition-all flex items-center justify-center"
          >
            <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="text-center text-xs text-slate-500">
          Don't have an account yet?
          <a routerLink="/auth/register" class="font-bold text-brand-600 hover:text-brand-700 ml-1">Create an account</a>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div *ngIf="showForgotModal" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-slate-900">Forgot Password?</h3>
                <p class="text-xs text-slate-500">We will dispatch a secure reset link via Mailtrap</p>
              </div>
            </div>
            <button (click)="closeForgotModal()" class="text-slate-400 hover:text-slate-600 p-1">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Success Message -->
          <div *ngIf="forgotSuccess" class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
            <div class="font-bold flex items-center">
              <svg class="w-4 h-4 mr-1.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
              Reset Email Dispatched!
            </div>
            <p>If an account exists for <strong>{{ forgotEmail }}</strong>, an email with the password reset link has been delivered to your Mailtrap inbox.</p>
          </div>

          <!-- Form -->
          <div *ngIf="!forgotSuccess" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Account Email</label>
              <input
                type="email"
                [(ngModel)]="forgotEmail"
                placeholder="e.g. youssef.benali@candidates.ma"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>

            <div *ngIf="forgotError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {{ forgotError }}
            </div>

            <div class="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                (click)="closeForgotModal()"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                (click)="sendResetEmail()"
                [disabled]="!forgotEmail || forgotLoading"
                class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition flex items-center shadow-sm"
              >
                <svg *ngIf="forgotLoading" class="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ forgotLoading ? 'Sending via Mailtrap...' : 'Send Reset Link' }}
              </button>
            </div>
          </div>

          <div *ngIf="forgotSuccess" class="pt-2 text-right">
            <button
              (click)="closeForgotModal()"
              class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  // Forgot password modal state
  showForgotModal = false;
  forgotEmail = '';
  forgotLoading = false;
  forgotSuccess = false;
  forgotError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole();
      if (role === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else if (role === 'RECRUITER') {
        this.router.navigate(['/recruiter/dashboard']);
      } else {
        this.router.navigate(['/candidate/dashboard']);
      }
    }
  }

  quickLogin(email: string, pass: string) {
    this.loginForm.patchValue({ email, password: pass });
    this.onSubmit();
  }

  openForgotModal() {
    this.showForgotModal = true;
    this.forgotEmail = this.loginForm.get('email')?.value || '';
    this.forgotSuccess = false;
    this.forgotError = '';
  }

  closeForgotModal() {
    this.showForgotModal = false;
    this.forgotSuccess = false;
    this.forgotError = '';
  }

  sendResetEmail() {
    if (!this.forgotEmail) return;

    this.forgotLoading = true;
    this.forgotError = '';

    this.authService.forgotPassword(this.forgotEmail).subscribe({
      next: () => {
        this.forgotLoading = false;
        this.forgotSuccess = true;
        this.toastService.success('Reset link dispatched! Please check your Mailtrap inbox.');
      },
      error: (err) => {
        this.forgotLoading = false;
        this.forgotError = err.error?.message || 'Failed to dispatch reset email. Please try again.';
        this.toastService.error(this.forgotError);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastService.success(`Welcome back, ${res.displayName}!`, 'Logged In');
        if (res.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (res.role === 'RECRUITER') {
          this.router.navigate(['/recruiter/dashboard']);
        } else {
          this.router.navigate(['/candidate/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid email or password';
        this.toastService.error(this.errorMessage, 'Authentication Failed');
      }
    });
  }
}
