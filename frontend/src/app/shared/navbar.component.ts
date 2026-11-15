import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo & Brand -->
          <div class="flex items-center space-x-3">
            <a routerLink="/" class="flex items-center space-x-2.5 group">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-800 bg-clip-text text-transparent">HireSmart <span class="text-brand-600 font-extrabold">AI</span></span>
                <span class="text-[10px] tracking-wider uppercase font-semibold text-slate-600 -mt-1">Intelligent Recruitment</span>
              </div>
            </a>

            <!-- Desktop Primary Links -->
            <div class="hidden md:flex items-center space-x-1 ml-6">
              <a routerLink="/jobs" routerLinkActive="text-brand-600 font-semibold bg-brand-50" [routerLinkActiveOptions]="{exact: false}" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors">
                Browse Jobs
              </a>

              <!-- Candidate Links -->
              <ng-container *ngIf="authService.isCandidate()">
                <!-- Candidate Dashboard with Hover Dropdown -->
                <div class="relative group py-2">
                  <a routerLink="/candidate/dashboard" routerLinkActive="text-brand-600 font-semibold bg-brand-50" class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors">
                    <span>Dashboard</span>
                    <svg class="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:text-brand-600 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </a>
                  <!-- Hover Dropdown Menu -->
                  <div class="absolute left-0 top-full -mt-0.5 pt-2 w-64 invisible opacity-0 -translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div class="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl p-2 space-y-1">
                      <a routerLink="/candidate/dashboard" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-brand-600">My Applications</div>
                          <div class="text-[10px] text-slate-500">Track application statuses</div>
                        </div>
                      </a>
                      <a routerLink="/candidate/profile" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-brand-600">Profile & CV</div>
                          <div class="text-[10px] text-slate-500">Update resume & skills</div>
                        </div>
                      </a>
                      <a routerLink="/jobs" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-brand-600">Explore Job Vacancies</div>
                          <div class="text-[10px] text-slate-500">Browse Moroccan market jobs</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                <a routerLink="/candidate/profile" routerLinkActive="text-brand-600 font-semibold bg-brand-50" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors">
                  Profile & CV
                </a>
              </ng-container>

              <!-- Admin Links -->
              <ng-container *ngIf="authService.isAdmin()">
                <!-- Admin Dashboard with Hover Dropdown -->
                <div class="relative group py-2">
                  <a routerLink="/admin/dashboard" routerLinkActive="text-brand-600 font-semibold bg-brand-50" class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors">
                    <span>Dashboard</span>
                    <svg class="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:text-brand-600 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </a>
                  <!-- Hover Dropdown Menu -->
                  <div class="absolute left-0 top-full -mt-0.5 pt-2 w-72 invisible opacity-0 -translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div class="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl p-2 space-y-1">
                      <a routerLink="/admin/dashboard" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-brand-600">Control Center</div>
                          <div class="text-[10px] text-slate-500">Platform KPIs & overview</div>
                        </div>
                      </a>
                      <a routerLink="/admin/skills" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-violet-600 flex items-center">
                            <span>Skills Registry</span>
                            <span class="ml-1.5 px-1.5 py-0.2 rounded text-[9px] bg-violet-100 text-violet-700 font-extrabold">NEW</span>
                          </div>
                          <div class="text-[10px] text-slate-500">View, add, edit & remove skills</div>
                        </div>
                      </a>
                      <a routerLink="/admin/users" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-brand-600">User Management</div>
                          <div class="text-[10px] text-slate-500">Accounts & permissions</div>
                        </div>
                      </a>
                      <a routerLink="/admin/jobs" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-brand-600">Moderate Jobs</div>
                          <div class="text-[10px] text-slate-500">All vacancies & postings</div>
                        </div>
                      </a>
                      <a routerLink="/admin/audit" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-amber-600">Audit Trail</div>
                          <div class="text-[10px] text-slate-500">Live security logs</div>
                        </div>
                      </a>
                      <a routerLink="/admin/system" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-purple-600">System Config</div>
                          <div class="text-[10px] text-slate-500">Live JVM & AI config</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                <a routerLink="/admin/users" routerLinkActive="text-brand-600 font-semibold bg-brand-50" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors">
                  Users
                </a>
                <a routerLink="/admin/jobs" routerLinkActive="text-brand-600 font-semibold bg-brand-50" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors">
                  All Jobs
                </a>
                <a routerLink="/admin/audit" routerLinkActive="text-brand-600 font-semibold bg-brand-50" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors">
                  Audit Logs
                </a>
                <a routerLink="/admin/system" routerLinkActive="text-brand-600 font-semibold bg-brand-50" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors">
                  System Config
                </a>
              </ng-container>

              <!-- Recruiter Links -->
              <ng-container *ngIf="authService.isRecruiter()">
                <!-- Recruiter Dashboard with Hover Dropdown -->
                <div class="relative group py-2">
                  <a routerLink="/recruiter/dashboard" routerLinkActive="text-brand-600 font-semibold bg-brand-50" class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors">
                    <span>Dashboard</span>
                    <svg class="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:text-brand-600 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </a>
                  <!-- Hover Dropdown Menu -->
                  <div class="absolute left-0 top-full -mt-0.5 pt-2 w-64 invisible opacity-0 -translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div class="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl p-2 space-y-1">
                      <a routerLink="/recruiter/dashboard" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-brand-600">Recruiter Overview</div>
                          <div class="text-[10px] text-slate-500">Pipeline & metrics summary</div>
                        </div>
                      </a>
                      <a routerLink="/recruiter/jobs" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-brand-600">Manage Job Offers</div>
                          <div class="text-[10px] text-slate-500">View, edit, or close jobs</div>
                        </div>
                      </a>
                      <a routerLink="/recruiter/jobs/new" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-brand-600">Post New Job</div>
                          <div class="text-[10px] text-slate-500">With skill auto-persistence</div>
                        </div>
                      </a>
                      <a routerLink="/recruiter/applications" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-brand-600">Candidates & CVs</div>
                          <div class="text-[10px] text-slate-500">AI match analysis & rankings</div>
                        </div>
                      </a>
                      <a routerLink="/recruiter/profile" class="flex items-center p-2.5 rounded-xl hover:bg-slate-50 group/item transition-colors">
                        <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mr-3 group-hover/item:scale-105 transition-transform">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <div class="text-xs font-bold text-slate-900 group-hover/item:text-brand-600">Company & Security</div>
                          <div class="text-[10px] text-slate-500">Settings & change password</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                <a routerLink="/recruiter/jobs" routerLinkActive="text-brand-600 font-semibold bg-brand-50" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors">
                  Manage Jobs
                </a>
                <a routerLink="/recruiter/applications" routerLinkActive="text-brand-600 font-semibold bg-brand-50" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors">
                  Candidates & CVs
                </a>
                <a routerLink="/recruiter/profile" routerLinkActive="text-brand-600 font-semibold bg-brand-50" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors">
                  Profile & Security
                </a>
              </ng-container>
            </div>
          </div>

          <!-- Auth & Profile Right Side -->
          <div class="hidden md:flex items-center space-x-3">
            <ng-container *ngIf="authService.currentUser$ | async as user; else guestNav">
              <div class="flex items-center space-x-3 pr-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  [ngClass]="{
                    'bg-emerald-100 text-emerald-800 border border-emerald-200': user.role === 'ADMIN',
                    'bg-purple-100 text-purple-800 border border-purple-200': user.role === 'RECRUITER',
                    'bg-brand-100 text-brand-800 border border-brand-200': user.role === 'CANDIDATE'
                  }">
                  {{ user.role === 'ADMIN' ? 'Administrator' : (user.role === 'RECRUITER' ? 'Recruiter' : 'Candidate') }}
                </span>
                <span class="text-sm font-medium text-slate-700 max-w-[160px] truncate">{{ user.displayName }}</span>
              </div>

              <button
                (click)="logout()"
                class="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:text-rose-600 transition-colors"
              >
                <svg class="w-4 h-4 mr-1.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Sign Out
              </button>
            </ng-container>

            <ng-template #guestNav>
              <a routerLink="/auth/login" class="px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors">
                Sign In
              </a>
              <a routerLink="/auth/register" class="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/20 hover:shadow-lg transition-all">
                Get Started
              </a>
            </ng-template>
          </div>

          <!-- Mobile Hamburger -->
          <div class="flex items-center md:hidden">
            <button (click)="mobileMenuOpen = !mobileMenuOpen" class="text-slate-500 hover:text-slate-700 p-2">
              <svg *ngIf="!mobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg *ngIf="mobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown -->
      <div *ngIf="mobileMenuOpen" class="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
        <a (click)="mobileMenuOpen = false" routerLink="/jobs" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">Browse Jobs</a>

        <ng-container *ngIf="authService.isAdmin()">
          <a (click)="mobileMenuOpen = false" routerLink="/admin/dashboard" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">Admin Dashboard</a>
          <a (click)="mobileMenuOpen = false" routerLink="/admin/skills" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between">
            <span>Skills Registry</span>
            <span class="px-2 py-0.5 rounded text-xs bg-violet-100 text-violet-700 font-bold">Permanent</span>
          </a>
          <a (click)="mobileMenuOpen = false" routerLink="/admin/users" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">Manage Users</a>
          <a (click)="mobileMenuOpen = false" routerLink="/admin/jobs" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">All Job Offers</a>
          <a (click)="mobileMenuOpen = false" routerLink="/admin/audit" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">Audit Trail</a>
          <a (click)="mobileMenuOpen = false" routerLink="/admin/system" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">System Configuration</a>
        </ng-container>

        <ng-container *ngIf="authService.isCandidate()">
          <a (click)="mobileMenuOpen = false" routerLink="/candidate/dashboard" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">My Applications</a>
          <a (click)="mobileMenuOpen = false" routerLink="/candidate/profile" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">Profile & CV</a>
        </ng-container>

        <ng-container *ngIf="authService.isRecruiter()">
          <a (click)="mobileMenuOpen = false" routerLink="/recruiter/dashboard" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">Recruiter Dashboard</a>
          <a (click)="mobileMenuOpen = false" routerLink="/recruiter/jobs" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">Manage Jobs</a>
          <a (click)="mobileMenuOpen = false" routerLink="/recruiter/applications" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">Candidates & CVs</a>
          <a (click)="mobileMenuOpen = false" routerLink="/recruiter/profile" class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">Profile & Security</a>
        </ng-container>

        <div class="pt-3 border-t border-slate-100 flex flex-col space-y-2">
          <ng-container *ngIf="authService.currentUser$ | async as user; else mobileGuest">
            <div class="px-3 py-1 text-sm text-slate-500">Signed in as <strong class="text-slate-800">{{ user.displayName }}</strong></div>
            <button (click)="logout(); mobileMenuOpen = false" class="w-full text-left px-3 py-2 text-rose-600 font-medium">Sign Out</button>
          </ng-container>
          <ng-template #mobileGuest>
            <a (click)="mobileMenuOpen = false" routerLink="/auth/login" class="block px-3 py-2 text-center rounded-lg border border-slate-200 font-medium text-slate-700">Sign In</a>
            <a (click)="mobileMenuOpen = false" routerLink="/auth/register" class="block px-3 py-2 text-center rounded-lg bg-brand-600 text-white font-medium">Get Started</a>
          </ng-template>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  mobileMenuOpen = false;

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
