import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';
import { AuditLog } from '../../core/models/admin.models';

@Component({
  selector: 'app-admin-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      <!-- Header & Breadcrumbs -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <a routerLink="/admin/dashboard" class="hover:text-brand-600">&larr; Admin Dashboard</a>
            <span>/</span>
            <span>Security & Compliance</span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Audit Trail</h1>
          <p class="text-xs text-slate-500 mt-0.5">Chronological immutable audit log of system operations, user logins, and administrative actions</p>
        </div>
        <div class="flex items-center space-x-2">
          <button
            (click)="loadAuditLogs()"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-sm inline-flex items-center"
          >
            <svg class="w-3.5 h-3.5 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Logs
          </button>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {{ filteredLogs.length }} Events Recorded
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
            placeholder="Search by action, actor, or details..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
          />
        </div>

        <div class="flex items-center space-x-2 w-full sm:w-auto">
          <label class="text-xs font-bold text-slate-600 whitespace-nowrap">Filter Action:</label>
          <select
            [(ngModel)]="selectedAction"
            class="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="ALL">All Event Types</option>
            <option value="USER_LOGIN">User Logins</option>
            <option value="USER_REGISTER">User Registrations</option>
            <option value="USER_DELETED">User Deletions</option>
            <option value="JOB_CREATED">Jobs Created</option>
            <option value="JOB_STATUS_MODERATED">Job Status Moderated</option>
            <option value="CONFIG_UPDATED">Config Changes</option>
          </select>
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        <div *ngIf="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
          <p class="mt-2 text-sm text-slate-500">Loading audit trail...</p>
        </div>

        <div *ngIf="!loading && filteredLogs.length === 0" class="text-center py-16">
          <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-sm font-bold text-slate-800">No audit events match your filter</h3>
          <p class="text-xs text-slate-500 mt-1">Try resetting the action filter or search query.</p>
        </div>

        <div *ngIf="!loading && filteredLogs.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 text-left">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th class="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Event / Action</th>
                <th class="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Actor</th>
                <th class="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Target Resource</th>
                <th class="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Event Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr *ngFor="let log of filteredLogs" class="hover:bg-slate-50/70 transition-colors">
                
                <!-- Timestamp -->
                <td class="px-6 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                  {{ log.createdAt | date:'yyyy-MM-dd HH:mm:ss' }}
                </td>

                <!-- Action Badge -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold"
                    [ngClass]="{
                      'bg-emerald-50 text-emerald-700 border border-emerald-200': log.action.includes('LOGIN') || log.action.includes('STARTUP'),
                      'bg-blue-50 text-blue-700 border border-blue-200': log.action.includes('REGISTER') || log.action.includes('PROVISIONED'),
                      'bg-purple-50 text-purple-700 border border-purple-200': log.action.includes('JOB') || log.action.includes('APPLICATION'),
                      'bg-amber-50 text-amber-700 border border-amber-200': log.action.includes('CONFIG') || log.action.includes('ROLE'),
                      'bg-rose-50 text-rose-700 border border-rose-200': log.action.includes('DELETE')
                    }"
                  >
                    {{ log.action }}
                  </span>
                </td>

                <!-- Actor -->
                <td class="px-6 py-4 text-xs">
                  <p class="font-bold text-slate-800">{{ log.actorEmail }}</p>
                  <p class="text-[11px] text-slate-500">{{ log.actorRole || 'SYSTEM' }}</p>
                </td>

                <!-- Target Resource -->
                <td class="px-6 py-4 text-xs font-semibold text-slate-700 whitespace-nowrap">
                  {{ log.targetResource || 'Platform Resource' }}
                </td>

                <!-- Details -->
                <td class="px-6 py-4 text-xs text-slate-600">
                  <p class="max-w-xl leading-relaxed">{{ log.details }}</p>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  `
})
export class AdminAuditComponent implements OnInit {
  logs: AuditLog[] = [];
  loading = true;
  searchQuery = '';
  selectedAction = 'ALL';

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs() {
    this.loading = true;
    this.adminService.getAuditLogs().subscribe({
      next: (res) => {
        this.logs = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Could not load audit log history');
      }
    });
  }

  get filteredLogs(): AuditLog[] {
    return this.logs.filter((log) => {
      let matchesAction = this.selectedAction === 'ALL';
      if (!matchesAction) {
        if (this.selectedAction === 'JOB_CREATED') {
          matchesAction = log.action === 'JOB_CREATED' || log.action === 'JOB_POSTED_BY_ADMIN';
        } else if (this.selectedAction === 'USER_REGISTER') {
          matchesAction = log.action === 'USER_REGISTER' || log.action === 'USER_PROVISIONED';
        } else {
          matchesAction = log.action === this.selectedAction;
        }
      }

      const q = this.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.action.toLowerCase().includes(q) ||
        log.actorEmail.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q)) ||
        (log.targetResource && log.targetResource.toLowerCase().includes(q));

      return matchesAction && matchesSearch;
    });
  }
}
