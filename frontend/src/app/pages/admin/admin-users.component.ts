import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { AdminUser, CreateUserRequest } from '../../core/models/admin.models';
import { Role } from '../../core/models/auth.models';

@Component({
  selector: 'app-admin-users',
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
            <span>User Management</span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Users Directory</h1>
          <p class="text-xs text-slate-500 mt-0.5">Manage, provision, and govern all registered candidate, recruiter, and administrator accounts</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            (click)="openCreateModal()"
            class="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Provision New User
          </button>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {{ filteredUsers.length }} / {{ users.length }} Users
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
            placeholder="Search by name, email, or skills..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
          />
        </div>

        <div class="flex items-center space-x-2 w-full sm:w-auto">
          <label class="text-xs font-bold text-slate-600 whitespace-nowrap">Filter Role:</label>
          <select
            [(ngModel)]="selectedRole"
            class="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="CANDIDATE">Candidates</option>
            <option value="RECRUITER">Recruiters</option>
            <option value="ADMIN">Administrators</option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        <div *ngIf="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
          <p class="mt-2 text-sm text-slate-500">Loading user accounts...</p>
        </div>

        <div *ngIf="!loading && filteredUsers.length === 0" class="text-center py-16">
          <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 class="text-sm font-bold text-slate-800">No users match your criteria</h3>
          <p class="text-xs text-slate-500 mt-1">Try adjusting your search query or role filter.</p>
        </div>

        <div *ngIf="!loading && filteredUsers.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User Account</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Current Role</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Information</th>
                <th class="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Registered</th>
                <th class="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr 
                *ngFor="let u of filteredUsers" 
                class="transition-colors"
                [ngClass]="u.role === 'ADMIN' 
                  ? 'bg-gradient-to-r from-amber-500/15 via-amber-50/50 to-white border-l-4 border-l-amber-500 shadow-2xs' 
                  : 'hover:bg-slate-50/70 border-l-4 border-l-transparent'"
              >
                
                <!-- User & Email -->
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-sm"
                      [ngClass]="{
                        'bg-amber-100 text-amber-900 ring-2 ring-amber-400': u.role === 'ADMIN',
                        'bg-purple-100 text-purple-800': u.role === 'RECRUITER',
                        'bg-brand-100 text-brand-800': u.role === 'CANDIDATE'
                      }"
                    >
                      <span *ngIf="u.role === 'ADMIN'">🛡️</span>
                      <span *ngIf="u.role !== 'ADMIN'">{{ u.displayName.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-bold text-slate-900">{{ u.displayName }}</p>
                        <span 
                          *ngIf="u.role === 'ADMIN'" 
                          class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-2xs inline-flex items-center gap-1"
                        >
                          <span>★</span> Pinned Administrator
                        </span>
                      </div>
                      <p class="text-xs text-slate-500 font-mono">{{ u.email }}</p>
                    </div>
                  </div>
                </td>

                <!-- Role Selector (Admins Locked; Non-admins Swapped between Candidate & Recruiter only) -->
                <td class="px-6 py-4">
                  <!-- For ADMIN: Role is permanently protected and cannot be downgraded -->
                  <div *ngIf="u.role === 'ADMIN'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                    <svg class="w-3.5 h-3.5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>ADMINISTRATOR</span>
                    <span class="text-[10px] font-semibold text-amber-800 bg-amber-200/90 px-1.5 py-0.5 rounded">Protected</span>
                  </div>

                  <!-- For non-admin: Can ONLY swap between RECRUITER and CANDIDATE -->
                  <div *ngIf="u.role !== 'ADMIN'" class="inline-flex items-center gap-2">
                    <select
                      [ngModel]="u.role"
                      (ngModelChange)="changeRole(u, $event)"
                      class="px-2.5 py-1.5 rounded-xl text-xs font-bold border transition focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer shadow-2xs"
                      [ngClass]="{
                        'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100': u.role === 'RECRUITER',
                        'bg-brand-50 text-brand-800 border-brand-200 hover:bg-brand-100': u.role === 'CANDIDATE'
                      }"
                    >
                      <option value="RECRUITER">💼 RECRUITER</option>
                      <option value="CANDIDATE">🎓 CANDIDATE</option>
                    </select>
                    <button
                      type="button"
                      (click)="toggleRoleSwap(u)"
                      class="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1 shadow-2xs"
                      [title]="'Swap to ' + (u.role === 'RECRUITER' ? 'Candidate' : 'Recruiter')"
                    >
                      <span>Swap</span>
                      <span class="text-slate-400">&harr;</span>
                    </button>
                  </div>
                </td>

                <!-- Profile Info -->
                <td class="px-6 py-4">
                  <p class="text-xs text-slate-600 max-w-md truncate">{{ u.subDetails || 'No details provided' }}</p>
                </td>

                <!-- Date -->
                <td class="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                  {{ u.createdAt | date:'MMM d, y, h:mm a' }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-right">
                  <span *ngIf="u.role === 'ADMIN'" class="px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 inline-flex items-center gap-1">
                    <span>🛡️</span> Protected
                  </span>
                  <button
                    *ngIf="u.role !== 'ADMIN'"
                    (click)="deleteUser(u)"
                    class="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                    title="Delete user account"
                  >
                    Delete Account
                  </button>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- Provision User Modal -->
      <div *ngIf="showCreateModal" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in duration-200">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Provision User Account</h3>
              <p class="text-xs text-slate-500">Create a candidate, recruiter, or administrator account</p>
            </div>
            <button (click)="showCreateModal = false" class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form (ngSubmit)="submitCreateUser()" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Account Role</label>
              <select
                [(ngModel)]="newUser.role"
                name="role"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="CANDIDATE">Candidate (Job Seeker)</option>
                <option value="RECRUITER">Recruiter (Hiring Employer)</option>
                <option value="ADMIN">Platform Administrator</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                [(ngModel)]="newUser.email"
                name="email"
                required
                placeholder="new.user@example.com"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
              <input
                type="password"
                [(ngModel)]="newUser.password"
                name="password"
                required
                placeholder="Minimum 6 characters"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <!-- Candidate specifics -->
            <div *ngIf="newUser.role === 'CANDIDATE'" class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">First Name</label>
                <input
                  type="text"
                  [(ngModel)]="newUser.firstName"
                  name="firstName"
                  placeholder="First name"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Last Name</label>
                <input
                  type="text"
                  [(ngModel)]="newUser.lastName"
                  name="lastName"
                  placeholder="Last name"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <!-- Recruiter specifics -->
            <div *ngIf="newUser.role === 'RECRUITER'">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company Name</label>
              <input
                type="text"
                [(ngModel)]="newUser.companyName"
                name="companyName"
                placeholder="e.g. Acme Cloud Corp"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {{ newUser.role === 'RECRUITER' ? 'Location (e.g. Casablanca / Remote)' : 'Professional Title (e.g. Sales Manager, Data Analyst, Engineer)' }}
              </label>
              <input
                type="text"
                [(ngModel)]="newUser.titleOrLocation"
                name="titleOrLocation"
                placeholder="Optional title or company location"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                (click)="showCreateModal = false"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="creating"
                class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
              >
                {{ creating ? 'Creating...' : 'Create Account' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  users: AdminUser[] = [];
  loading = true;
  searchQuery = '';
  selectedRole = 'ALL';
  currentUserId: number | null = null;

  showCreateModal = false;
  creating = false;
  newUser: CreateUserRequest = {
    email: '',
    password: '',
    role: 'CANDIDATE',
    firstName: '',
    lastName: '',
    companyName: '',
    titleOrLocation: ''
  };

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const session = this.authService.getCurrentUser();
    this.currentUserId = session ? session.id : null;
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Failed to load platform users');
      }
    });
  }

  get filteredUsers(): AdminUser[] {
    const list = this.users.filter((user) => {
      const matchesRole = this.selectedRole === 'ALL' || user.role === this.selectedRole;
      const query = this.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        user.displayName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.subDetails && user.subDetails.toLowerCase().includes(query));

      return matchesRole && matchesSearch;
    });

    // Always sort administrators to the top with isolated prominence
    return list.sort((a, b) => {
      if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
      if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  changeRole(user: AdminUser, newRole: Role) {
    if (user.role === 'ADMIN') {
      this.toastService.error('Administrator accounts are protected and cannot be downgraded.');
      return;
    }
    if (newRole !== 'RECRUITER' && newRole !== 'CANDIDATE') {
      this.toastService.error('Roles can only be swapped between Recruiter and Candidate.');
      return;
    }
    if (user.role === newRole) return;
    if (!confirm(`Change role for "${user.displayName}" from ${user.role} to ${newRole}?`)) {
      return;
    }

    this.adminService.updateUserRole(user.id, newRole).subscribe({
      next: (updated) => {
        user.role = updated.role;
        this.toastService.success(`Role for ${user.displayName} updated to ${newRole}.`, 'Role Changed');
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Could not update user role');
      }
    });
  }

  toggleRoleSwap(user: AdminUser) {
    if (user.role === 'ADMIN') {
      this.toastService.error('Administrator accounts cannot be altered.');
      return;
    }
    const targetRole: Role = user.role === 'RECRUITER' ? 'CANDIDATE' : 'RECRUITER';
    this.changeRole(user, targetRole);
  }

  openCreateModal() {
    this.newUser = {
      email: '',
      password: '',
      role: 'CANDIDATE',
      firstName: '',
      lastName: '',
      companyName: '',
      titleOrLocation: ''
    };
    this.showCreateModal = true;
  }

  submitCreateUser() {
    if (!this.newUser.email || !this.newUser.password) {
      this.toastService.error('Email and password are required');
      return;
    }

    this.creating = true;
    this.adminService.createUser(this.newUser).subscribe({
      next: (created) => {
        this.creating = false;
        this.showCreateModal = false;
        this.toastService.success(`User "${created.displayName}" created successfully!`, 'Account Provisioned');
        this.loadUsers();
      },
      error: (err) => {
        this.creating = false;
        this.toastService.error(err.error?.message || 'Failed to create user account');
      }
    });
  }

  deleteUser(user: AdminUser) {
    if (!confirm(`Are you sure you want to permanently delete user account "${user.displayName}" (${user.email})? This action cascades all associated data.`)) {
      return;
    }

    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.toastService.success(`User "${user.displayName}" deleted successfully.`, 'Account Removed');
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Could not delete user account');
      }
    });
  }
}
