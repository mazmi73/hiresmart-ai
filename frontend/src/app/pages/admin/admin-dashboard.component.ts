import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { AdminStats } from '../../core/models/admin.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              Platform Administration
            </span>
            <span class="text-xs text-slate-400 font-medium">&bull; System Overview & Registry</span>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Administrator Control Center</h1>
          <p class="text-sm text-slate-500 mt-1">Global governance of users, job opportunities, applications pipeline, and permanent skills registry</p>
        </div>
        <div class="flex items-center space-x-3">
          <a
            routerLink="/admin/skills"
            class="px-4 py-2.5 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 transition shadow-sm inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-1.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            Skills Registry
          </a>
          <a
            routerLink="/admin/users"
            class="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-sm inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Manage Users
          </a>
          <a
            routerLink="/admin/jobs"
            class="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-1.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Moderate Jobs
          </a>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand-500 border-t-transparent"></div>
        <p class="mt-3 text-sm font-semibold text-slate-600">Aggregating platform metrics...</p>
      </div>

      <!-- 7-Column Responsive Stats Grid -->
      <div *ngIf="!loading && stats" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        
        <!-- Total Users Card -->
        <a routerLink="/admin/users" class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all block cursor-pointer">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <span class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ stats.totalUsers }}</span>
            <span class="text-xs text-slate-500 ml-1 font-medium">accounts</span>
          </div>
          <div class="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>{{ stats.totalAdmins }} Platform Admin</span>
            <span class="text-emerald-600 font-semibold group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </a>

        <!-- Candidates Counter Card -->
        <a routerLink="/admin/users" class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all block cursor-pointer">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidates</span>
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <span class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ stats.totalCandidates }}</span>
            <span class="text-xs text-slate-500 ml-1 font-medium">candidates</span>
          </div>
          <div class="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Active Job Seekers</span>
            <span class="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </a>

        <!-- Recruiters Counter Card -->
        <a routerLink="/admin/users" class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all block cursor-pointer">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Recruiters</span>
            <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <span class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ stats.totalRecruiters }}</span>
            <span class="text-xs text-slate-500 ml-1 font-medium">recruiters</span>
          </div>
          <div class="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Hiring Employers</span>
            <span class="text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </a>

        <!-- Total Job Offers Card -->
        <a routerLink="/admin/jobs" class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all block cursor-pointer">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Offers</span>
            <div class="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <span class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ stats.totalJobOffers }}</span>
            <span class="text-xs text-slate-500 ml-1 font-medium">postings</span>
          </div>
          <div class="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span class="text-emerald-600 font-semibold">{{ stats.activeJobOffers }} Active</span>
            <span>&bull;</span>
            <span>{{ stats.closedJobOffers }} Closed</span>
          </div>
        </a>

        <!-- Total Applications Card -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Applications</span>
            <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <span class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ stats.totalApplications }}</span>
            <span class="text-xs text-slate-500 ml-1 font-medium">submissions</span>
          </div>
          <div class="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>{{ stats.totalAnalyzedApplications }} Analyzed by AI</span>
          </div>
        </div>

        <!-- AI Match Average Card -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Score Avg</span>
            <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <span class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ stats.averageMatchScore }}%</span>
            <span class="text-xs text-slate-500 ml-1 font-medium">overlap</span>
          </div>
          <div class="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Deterministic Scoring</span>
          </div>
        </div>

        <!-- Permanent Skills Registry Card (Matches exact style of other cards) -->
        <a routerLink="/admin/skills" class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-violet-300 transition-all cursor-pointer block">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Skills Registry</span>
            <div class="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <span class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ stats.totalSkills }}</span>
            <span class="text-xs text-slate-500 ml-1 font-medium">skills in DB</span>
          </div>
          <div class="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Database Registry</span>
            <span class="text-violet-600 font-semibold group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </a>

      </div>

      <!-- Governance Actions Cards (5 Hubs) -->
      <div *ngIf="!loading && stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Skills Hub Card -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-violet-300 transition-all">
          <div>
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <h2 class="text-base font-bold text-slate-900">Skills Registry</h2>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">
              Audit, add, modify, or permanently remove competencies in the central PostgreSQL database.
            </p>
          </div>
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-violet-700">{{ stats.totalSkills }} Permanent Skills</span>
            <a routerLink="/admin/skills" class="text-xs font-bold text-violet-600 hover:text-violet-800 transition">
              Manage Registry &rarr;
            </a>
          </div>
        </div>

        <!-- User Hub Card -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all">
          <div>
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 class="text-base font-bold text-slate-900">User Management</h2>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">
              Provision accounts, adjust candidate/recruiter roles, and manage credentials.
            </p>
          </div>
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500">{{ stats.totalUsers }} Accounts</span>
            <a routerLink="/admin/users" class="text-xs font-bold text-brand-600 hover:text-brand-800 transition">
              Manage Users &rarr;
            </a>
          </div>
        </div>

        <!-- Job Hub Card -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-brand-300 transition-all">
          <div>
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h2 class="text-base font-bold text-slate-900">Job Governance</h2>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">
              Moderate postings, toggle open/closed statuses, or publish vacancies.
            </p>
          </div>
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500">{{ stats.totalJobOffers }} Postings</span>
            <a routerLink="/admin/jobs" class="text-xs font-bold text-brand-600 hover:text-brand-800 transition">
              Moderate Jobs &rarr;
            </a>
          </div>
        </div>

        <!-- Audit Trail Card -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all">
          <div>
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h2 class="text-base font-bold text-slate-900">Audit Logs</h2>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">
              Track real-time security events, user logins, data mutations, and administrative activities.
            </p>
          </div>
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-emerald-600 font-mono">Immutable</span>
            <a routerLink="/admin/audit" class="text-xs font-bold text-brand-600 hover:text-brand-800 transition">
              View Audit Trail &rarr;
            </a>
          </div>
        </div>

        <!-- System Configuration Card -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all">
          <div>
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 class="text-base font-bold text-slate-900">System Config</h2>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">
              Configure AI engines, match thresholds, upload limits, and inspect live JVM telemetry.
            </p>
          </div>
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500">Live Telemetry</span>
            <a routerLink="/admin/system" class="text-xs font-bold text-brand-600 hover:text-brand-800 transition">
              Configure Platform &rarr;
            </a>
          </div>
        </div>

      </div>

      <!-- System Architecture & Stack Badge -->
      <div class="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Platform Operational Status: Healthy</span>
            </div>
            <h3 class="text-lg font-bold mt-1">HireSmart AI Modular Monolith Architecture</h3>
            <p class="text-xs text-slate-300 mt-0.5">
              Backend: Spring Boot 3.3.4 (Java 21) &bull; Frontend: Angular 18 (Nginx) &bull; Database: PostgreSQL 16 &bull; PDF Parser: Apache PDFBox
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-white border border-white/10">
              Docker Network: hiresmart-network
            </span>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminStats | null = null;
  loading = true;

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Failed to load administrator statistics');
      }
    });
  }
}
