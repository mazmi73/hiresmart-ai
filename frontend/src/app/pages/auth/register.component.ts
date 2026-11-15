import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Role } from '../../core/models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div class="text-center">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/20">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h2 class="mt-4 text-2xl font-black text-slate-900 tracking-tight">Create an Account</h2>
          <p class="mt-1 text-sm text-slate-500">Join HireSmart AI recruitment platform</p>
        </div>

        <!-- Role Selector Tabs -->
        <div class="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            (click)="setRole('CANDIDATE')"
            [class.bg-white]="selectedRole === 'CANDIDATE'"
            [class.shadow-sm]="selectedRole === 'CANDIDATE'"
            [class.text-brand-600]="selectedRole === 'CANDIDATE'"
            [class.font-bold]="selectedRole === 'CANDIDATE'"
            class="py-2 text-xs font-semibold rounded-lg text-slate-600 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span>Candidate</span>
          </button>
          <button
            type="button"
            (click)="setRole('RECRUITER')"
            [class.bg-white]="selectedRole === 'RECRUITER'"
            [class.shadow-sm]="selectedRole === 'RECRUITER'"
            [class.text-purple-600]="selectedRole === 'RECRUITER'"
            [class.font-bold]="selectedRole === 'RECRUITER'"
            class="py-2 text-xs font-semibold rounded-lg text-slate-600 transition-all flex items-center justify-center space-x-1.5"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <span>Recruiter</span>
          </button>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-6 space-y-4">
          <!-- Candidate Fields -->
          <div *ngIf="selectedRole === 'CANDIDATE'" class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">First Name</label>
              <input
                type="text"
                formControlName="firstName"
                placeholder="Alex"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Last Name</label>
              <input
                type="text"
                formControlName="lastName"
                placeholder="Vance"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
          </div>

          <!-- Recruiter Fields -->
          <div *ngIf="selectedRole === 'RECRUITER'">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company Name</label>
            <input
              type="text"
              formControlName="companyName"
              placeholder="TechNova Innovations"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              formControlName="email"
              placeholder="name@example.com"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password (min 6 chars)</label>
            <input
              type="password"
              formControlName="password"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
          </div>

          <div *ngIf="errorMessage" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || loading"
            class="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 transition-all flex items-center justify-center"
          >
            <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Creating Account...' : 'Complete Registration' }}
          </button>
        </form>

        <div class="text-center text-xs text-slate-500">
          Already have an account?
          <a routerLink="/auth/login" class="font-bold text-brand-600 hover:text-brand-700 ml-1">Sign in</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  selectedRole: Role = 'CANDIDATE';
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [''],
      lastName: [''],
      companyName: ['']
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

  setRole(role: Role) {
    this.selectedRole = role;
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      ...this.registerForm.value,
      role: this.selectedRole
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastService.success(`Welcome to HireSmart AI, ${res.displayName}!`, 'Account Created');
        if (res.role === 'RECRUITER') {
          this.router.navigate(['/recruiter/dashboard']);
        } else {
          this.router.navigate(['/candidate/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        this.toastService.error(this.errorMessage, 'Error');
      }
    });
  }
}
