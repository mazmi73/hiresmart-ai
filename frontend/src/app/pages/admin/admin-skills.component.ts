import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Skill, SkillRequest } from '../../core/models/admin.models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-skills',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <!-- Breadcrumbs & Navigation Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <a routerLink="/admin/dashboard" class="hover:text-violet-600 transition flex items-center">
              <svg class="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Control Center
            </a>
            <span>/</span>
            <span class="text-violet-700 font-bold">Skills Registry</span>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Database Skills Registry</span>
            <span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-violet-100 text-violet-800 border border-violet-200">
              {{ skills.length }} Permanent Skills
            </span>
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Permanent repository of all skills registered on HireSmart AI. Filtered by most recent by default.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <button
            (click)="loadSkills()"
            [disabled]="loading"
            class="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition border border-slate-300 shadow-sm inline-flex items-center"
            title="Reload skills from database"
          >
            <svg class="w-4 h-4 mr-1.5 text-slate-500" [ngClass]="{'animate-spin': loading}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Refresh List
          </button>
          <button
            (click)="openAddModal()"
            class="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-brand-600 hover:from-violet-700 hover:to-brand-700 transition shadow-md shadow-violet-500/20 inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
            </svg>
            + Add New Skill
          </button>
        </div>
      </div>

      <!-- Quick Info Banner -->
      <div class="bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-brand-500/10 border border-violet-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <div>
            <h2 class="font-bold text-slate-900 text-sm">Permanent Database Persistence Active</h2>
            <p class="text-slate-600 mt-0.5">
              Recruiter-added skills and platform foundational competencies remain permanently stored even if job offers are deleted.
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2 text-[11px] font-semibold text-violet-800 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-violet-200 shrink-0">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>PostgreSQL Table: <code>skills</code></span>
        </div>
      </div>

      <!-- Main Registry Container -->
      <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">

        <!-- Toolbar: Search, Category & Sort Filter -->
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          <!-- Search input -->
          <div class="sm:col-span-5 relative">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearchChange()"
              placeholder="Search skills by name (e.g. Java, Docker, B2B Sales, CRM)..."
              class="w-full pl-9 pr-8 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-800 placeholder-slate-400 bg-slate-50/60"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <button
              *ngIf="searchQuery"
              (click)="clearSearch()"
              class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-sm w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-200"
            >
              &times;
            </button>
          </div>

          <!-- Category filter -->
          <div class="sm:col-span-4">
            <select
              [(ngModel)]="selectedCategory"
              (change)="onCategoryChange()"
              class="w-full py-2.5 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-800 bg-white font-semibold"
            >
              <option value="">All Categories ({{ skills.length }})</option>
              <option *ngFor="let cat of availableCategories" [value]="cat">
                {{ cat }} ({{ getCategoryCount(cat) }})
              </option>
            </select>
          </div>

          <!-- Sort dropdown (Recent by default) -->
          <div class="sm:col-span-3">
            <select
              [(ngModel)]="selectedSort"
              (change)="onSortChange()"
              class="w-full py-2.5 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-800 bg-white font-semibold"
            >
              <option value="recent">Sort: Most Recent First (Default)</option>
              <option value="oldest">Sort: Oldest Added First</option>
              <option value="name_asc">Sort: Skill Name (A &rarr; Z)</option>
              <option value="name_desc">Sort: Skill Name (Z &rarr; A)</option>
            </select>
          </div>

        </div>

        <!-- Skills Table Container -->
        <div class="border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
          
          <!-- Loading indicator -->
          <div *ngIf="loading" class="py-16 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-violet-500 border-t-transparent"></div>
            <p class="mt-3 text-xs font-semibold text-slate-600">Querying permanent skills registry...</p>
          </div>

          <!-- Table Content -->
          <div *ngIf="!loading" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead class="bg-slate-50/90 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="py-3 px-4 w-12">#</th>
                  <th class="py-3 px-4">Skill Name</th>
                  <th class="py-3 px-4">Normalized Identifier</th>
                  <th class="py-3 px-4">Category / Domain</th>
                  <th class="py-3 px-4">Added Date</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                <tr *ngFor="let skill of pagedSkills; let i = index" class="hover:bg-slate-50/70 transition-colors">
                  <!-- Index -->
                  <td class="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {{ (currentPage - 1) * pageSize + i + 1 }}
                  </td>

                  <!-- Skill Name -->
                  <td class="py-3.5 px-4 font-bold text-slate-900">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-violet-50 text-violet-900 border border-violet-200/60 shadow-xs">
                      {{ skill.name }}
                    </span>
                  </td>

                  <!-- Normalized Name -->
                  <td class="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {{ skill.normalizedName }}
                  </td>

                  <!-- Category -->
                  <td class="py-3.5 px-4">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                      [ngClass]="getCategoryBadgeClass(skill.category)"
                    >
                      {{ skill.category || 'General' }}
                    </span>
                  </td>

                  <!-- Added Date -->
                  <td class="py-3.5 px-4 text-slate-500 text-[11px]">
                    <div class="flex items-center space-x-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{{ skill.createdAt | date:'MMM d, y, h:mm a' }}</span>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="py-3.5 px-4 text-right">
                    <div class="inline-flex items-center space-x-1.5">
                      <!-- Edit Button -->
                      <button
                        (click)="openEditModal(skill)"
                        class="p-1.5 text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
                        title="Modify skill"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>

                      <!-- Delete Button -->
                      <button
                        (click)="openDeleteModal(skill)"
                        class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Remove skill from database"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr *ngIf="filteredSkills.length === 0">
                  <td colspan="6" class="py-14 text-center text-slate-500">
                    <div class="max-w-sm mx-auto space-y-2">
                      <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                      </div>
                      <p class="text-sm font-bold text-slate-700">No skills found</p>
                      <p class="text-xs text-slate-400">
                        No database skills matched your search criteria "{{ searchQuery }}".
                      </p>
                      <button
                        (click)="clearSearch()"
                        class="mt-2 text-xs font-bold text-violet-600 hover:text-violet-800"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div *ngIf="!loading && filteredSkills.length > 0" class="py-3 px-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div class="flex items-center space-x-2">
              <span>Showing</span>
              <span class="font-bold text-slate-900">{{ (currentPage - 1) * pageSize + 1 }}</span>
              <span>to</span>
              <span class="font-bold text-slate-900">{{ Math.min(currentPage * pageSize, filteredSkills.length) }}</span>
              <span>of</span>
              <span class="font-bold text-slate-900">{{ filteredSkills.length }}</span>
              <span>skills</span>
            </div>

            <div class="flex items-center space-x-2">
              <button
                (click)="setPage(currentPage - 1)"
                [disabled]="currentPage === 1"
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                &larr; Previous
              </button>
              <span class="font-medium px-2">Page {{ currentPage }} of {{ totalPages }}</span>
              <button
                (click)="setPage(currentPage + 1)"
                [disabled]="currentPage === totalPages"
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next &rarr;
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- ============================================================== -->
    <!-- ADD SKILL MODAL                                                -->
    <!-- ============================================================== -->
    <div *ngIf="showAddModal" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
              +
            </div>
            <h3 class="text-base font-extrabold text-slate-900">Add New Permanent Skill</h3>
          </div>
          <button (click)="closeAddModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
        </div>

        <form (ngSubmit)="submitAddSkill()" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Skill Name <span class="text-rose-500">*</span></label>
            <input
              type="text"
              [(ngModel)]="newSkillName"
              name="newSkillName"
              placeholder="e.g. Kotlin Multiplatform, Solvency II, B2B Cold Calling..."
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 text-xs text-slate-800"
              required
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Category / Domain</label>
            <input
              type="text"
              [(ngModel)]="newSkillCategory"
              name="newSkillCategory"
              placeholder="e.g. Software Development, Banking, Sales, Engineering..."
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 text-xs text-slate-800"
            />
            <div class="flex flex-wrap gap-1.5 mt-2">
              <span
                *ngFor="let quickCat of commonCategorySuggestions"
                (click)="newSkillCategory = quickCat"
                class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-700 cursor-pointer transition"
              >
                {{ quickCat }}
              </span>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              (click)="closeAddModal()"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="savingSkill || !newSkillName.trim()"
              class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 transition shadow-sm inline-flex items-center"
            >
              <svg *ngIf="savingSkill" class="animate-spin w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Save to Database
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- EDIT SKILL MODAL                                               -->
    <!-- ============================================================== -->
    <div *ngIf="showEditModal" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <h3 class="text-base font-extrabold text-slate-900">Modify Skill</h3>
          </div>
          <button (click)="closeEditModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
        </div>

        <form (ngSubmit)="submitEditSkill()" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Skill Name <span class="text-rose-500">*</span></label>
            <input
              type="text"
              [(ngModel)]="editSkillName"
              name="editSkillName"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs text-slate-800"
              required
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Category / Domain</label>
            <input
              type="text"
              [(ngModel)]="editSkillCategory"
              name="editSkillCategory"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs text-slate-800"
            />
            <div class="flex flex-wrap gap-1.5 mt-2">
              <span
                *ngFor="let quickCat of commonCategorySuggestions"
                (click)="editSkillCategory = quickCat"
                class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer transition"
              >
                {{ quickCat }}
              </span>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              (click)="closeEditModal()"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="savingSkill || !editSkillName.trim()"
              class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm inline-flex items-center"
            >
              <svg *ngIf="savingSkill" class="animate-spin w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- DELETE CONFIRMATION MODAL                                      -->
    <!-- ============================================================== -->
    <div *ngIf="showDeleteModal && skillToDelete" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center space-x-3 text-rose-600">
          <div class="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-base font-extrabold text-slate-900">Remove Skill?</h3>
            <p class="text-xs text-slate-500">Permanent removal from database</p>
          </div>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to permanently delete <strong class="text-slate-900 font-bold">"{{ skillToDelete.name }}"</strong>?
          It will no longer appear in autosuggestions for recruiters or candidates.
        </p>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
          <button
            type="button"
            (click)="closeDeleteModal()"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            (click)="confirmDeleteSkill()"
            [disabled]="deletingSkill"
            class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition shadow-sm inline-flex items-center"
          >
            <svg *ngIf="deletingSkill" class="animate-spin w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Yes, Delete Skill
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminSkillsComponent implements OnInit {
  skills: Skill[] = [];
  filteredSkills: Skill[] = [];
  loading = true;

  searchQuery = '';
  selectedCategory = '';
  selectedSort = 'recent'; // Recent by default!
  availableCategories: string[] = [];

  currentPage = 1;
  pageSize = 15;
  Math = Math;

  commonCategorySuggestions = [
    'Software & Web Development',
    'Mobile Development',
    'Cloud, DevOps & Systems',
    'Data & AI / Machine Learning',
    'Cybersecurity & Networking',
    'Business, Finance & Banking',
    'Sales, Marketing & Retail',
    'Supply Chain & Engineering',
    'Management, HR & Operations'
  ];

  showAddModal = false;
  newSkillName = '';
  newSkillCategory = '';
  savingSkill = false;

  showEditModal = false;
  editingSkill: Skill | null = null;
  editSkillName = '';
  editSkillCategory = '';

  showDeleteModal = false;
  skillToDelete: Skill | null = null;
  deletingSkill = false;

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.loading = true;
    this.adminService.getSkills('', undefined, this.selectedSort).subscribe({
      next: (data) => {
        this.skills = data || [];
        this.extractCategories();
        this.applyLocalFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Failed to load skills registry');
      }
    });
  }

  extractCategories(): void {
    const cats = new Set<string>();
    for (const s of this.skills) {
      if (s.category && s.category.trim()) {
        cats.add(s.category.trim());
      }
    }
    this.availableCategories = Array.from(cats).sort();
  }

  getCategoryCount(cat: string): number {
    return this.skills.filter(s => (s.category || 'General').toLowerCase() === cat.toLowerCase()).length;
  }

  getCategoryBadgeClass(category?: string): string {
    const cat = (category || 'General').toLowerCase();
    if (cat.includes('software') || cat.includes('web')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (cat.includes('mobile')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (cat.includes('cloud') || cat.includes('devops')) {
      return 'bg-sky-50 text-sky-700 border-sky-200';
    }
    if (cat.includes('data') || cat.includes('ai')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (cat.includes('cyber') || cat.includes('security') || cat.includes('network')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (cat.includes('finance') || cat.includes('banking')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (cat.includes('sales') || cat.includes('marketing') || cat.includes('retail')) {
      return 'bg-orange-50 text-orange-700 border-orange-200';
    }
    if (cat.includes('supply') || cat.includes('engineering')) {
      return 'bg-teal-50 text-teal-700 border-teal-200';
    }
    if (cat.includes('management') || cat.includes('hr')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  }

  applyLocalFilters(): void {
    let result = [...this.skills];

    if (this.selectedCategory) {
      result = result.filter(s => (s.category || 'General').toLowerCase() === this.selectedCategory.toLowerCase());
    }

    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q)) ||
        s.normalizedName.includes(q)
      );
    }

    this.filteredSkills = result;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyLocalFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.applyLocalFilters();
  }

  onCategoryChange(): void {
    this.applyLocalFilters();
  }

  onSortChange(): void {
    this.loadSkills();
  }

  get pagedSkills(): Skill[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSkills.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredSkills.length / this.pageSize));
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openAddModal(): void {
    this.newSkillName = '';
    this.newSkillCategory = '';
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.savingSkill = false;
  }

  submitAddSkill(): void {
    if (!this.newSkillName.trim()) return;

    this.savingSkill = true;
    const request: SkillRequest = {
      name: this.newSkillName.trim(),
      category: this.newSkillCategory.trim() || undefined
    };

    this.adminService.createSkill(request).subscribe({
      next: (created) => {
        this.toastService.success(`Skill "${created.name}" added successfully to database!`);
        this.closeAddModal();
        this.loadSkills();
      },
      error: (err) => {
        this.savingSkill = false;
        const msg = err.error?.message || 'Failed to add skill';
        this.toastService.error(msg);
      }
    });
  }

  openEditModal(skill: Skill): void {
    this.editingSkill = skill;
    this.editSkillName = skill.name;
    this.editSkillCategory = skill.category || '';
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingSkill = null;
    this.savingSkill = false;
  }

  submitEditSkill(): void {
    if (!this.editingSkill || !this.editSkillName.trim()) return;

    this.savingSkill = true;
    const request: SkillRequest = {
      name: this.editSkillName.trim(),
      category: this.editSkillCategory.trim() || undefined
    };

    this.adminService.updateSkill(this.editingSkill.id, request).subscribe({
      next: (updated) => {
        this.toastService.success(`Skill "${updated.name}" updated successfully!`);
        this.closeEditModal();
        this.loadSkills();
      },
      error: (err) => {
        this.savingSkill = false;
        const msg = err.error?.message || 'Failed to update skill';
        this.toastService.error(msg);
      }
    });
  }

  openDeleteModal(skill: Skill): void {
    this.skillToDelete = skill;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.skillToDelete = null;
    this.deletingSkill = false;
  }

  confirmDeleteSkill(): void {
    if (!this.skillToDelete) return;

    this.deletingSkill = true;
    const id = this.skillToDelete.id;
    const name = this.skillToDelete.name;

    this.adminService.deleteSkill(id).subscribe({
      next: () => {
        this.toastService.success(`Skill "${name}" permanently removed.`);
        this.closeDeleteModal();
        this.loadSkills();
      },
      error: (err) => {
        this.deletingSkill = false;
        const msg = err.error?.message || 'Failed to remove skill';
        this.toastService.error(msg);
      }
    });
  }
}
