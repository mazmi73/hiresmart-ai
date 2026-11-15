import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecruiterService } from '../../core/services/recruiter.service';
import { ApplicationService } from '../../core/services/application.service';
import { ToastService } from '../../core/services/toast.service';
import { Application, ApplicationStatus, CVAnalysis } from '../../core/models/application.models';
import { JobOffer } from '../../core/models/job.models';
import { AiAnalysisModalComponent } from '../../shared/ai-analysis-modal.component';

@Component({
  selector: 'app-recruiter-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AiAnalysisModalComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <!-- Top Title and Filter -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Candidate Pipeline & CVs</h1>
          <p class="text-sm text-slate-500 mt-1">Review applicant profiles, securely access PDF CVs and run AI skills matching</p>
        </div>

        <!-- Filter by Job, AI Model & High Match controls -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Active AI Model Custom Dropdown Menu -->
          <div class="relative inline-block text-left">
            <!-- Transparent backdrop when dropdown is open to capture clicks outside -->
            <div
              *ngIf="isAiDropdownOpen"
              (click)="isAiDropdownOpen = false"
              class="fixed inset-0 z-30 cursor-default"
            ></div>

            <!-- Stylish Trigger Capsule -->
            <button
              type="button"
              (click)="isAiDropdownOpen = !isAiDropdownOpen"
              class="relative z-40 group flex items-center space-x-2.5 bg-gradient-to-r from-purple-50/90 via-indigo-50/80 to-white hover:from-purple-100 hover:via-indigo-100 hover:to-white border border-purple-200/90 hover:border-purple-300 rounded-2xl px-3.5 py-1.5 shadow-2xs hover:shadow-sm transition-all duration-200 select-none text-left"
            >
              <!-- Icon indicator -->
              <span
                class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shadow-2xs transition-transform group-hover:scale-105"
                [ngClass]="getSelectedEngine().iconClass"
              >
                <ng-container [ngSwitch]="selectedAiEngine">
                  <!-- Ollama Local LLM Desktop/Chip -->
                  <svg *ngSwitchCase="'OLLAMA'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <!-- Gemini Sparkle -->
                  <svg *ngSwitchCase="'GEMINI'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                  <!-- Groq Lightning -->
                  <svg *ngSwitchCase="'GROQ'" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                  </svg>
                  <!-- Mistral Router -->
                  <svg *ngSwitchCase="'MISTRAL'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <!-- Local Engine CPU -->
                  <svg *ngSwitchDefault class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                  </svg>
                </ng-container>
              </span>

              <!-- Text block -->
              <div class="flex flex-col text-left">
                <span class="text-[9px] font-extrabold text-purple-700 uppercase tracking-widest leading-none">AI Engine</span>
                <span class="text-xs font-black text-slate-900 leading-tight flex items-center gap-1.5 mt-0.5">
                  {{ getSelectedEngine().name }}
                </span>
              </div>

              <!-- Auto-Failover Shield Badge -->
              <span class="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 px-2 py-0.5 rounded-full shadow-2xs">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Auto-Failover</span>
              </span>

              <!-- Rotating Chevron -->
              <svg
                class="w-4 h-4 text-purple-700 transition-transform duration-200 ml-1"
                [class.rotate-180]="isAiDropdownOpen"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu Floating Panel -->
            <div
              *ngIf="isAiDropdownOpen"
              class="absolute left-0 mt-2 z-50 w-84 md:w-96 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-2.5 space-y-1.5 transition-all duration-200 animate-in fade-in zoom-in-95"
            >
              <!-- Panel Header -->
              <div class="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">AI Orchestrator</span>
                  <span class="text-xs font-bold text-slate-800">Select Primary Model Engine</span>
                </div>
                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <svg class="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd"/>
                  </svg>
                  Failover Protected
                </span>
              </div>

              <!-- Options List -->
              <div class="space-y-1">
                <button
                  *ngFor="let engine of aiEngines"
                  type="button"
                  (click)="selectAiEngine(engine.id)"
                  class="w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between group border"
                  [ngClass]="selectedAiEngine === engine.id ? 'bg-purple-50/80 border-purple-200/90 shadow-2xs' : 'border-transparent hover:bg-slate-50 hover:border-slate-200/60'"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-2xs flex-shrink-0"
                      [ngClass]="engine.iconClass"
                    >
                      <ng-container [ngSwitch]="engine.id">
                        <svg *ngSwitchCase="'OLLAMA'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <svg *ngSwitchCase="'GEMINI'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                        </svg>
                        <svg *ngSwitchCase="'GROQ'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                        </svg>
                        <svg *ngSwitchCase="'MISTRAL'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        <svg *ngSwitchDefault class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                        </svg>
                      </ng-container>
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-1.5">
                        <span class="text-xs font-black text-slate-900 group-hover:text-purple-900 transition-colors">
                          {{ engine.name }}
                        </span>
                        <span class="px-1.5 py-0.2 rounded text-[9px] font-bold border" [ngClass]="engine.badgeClass">
                          {{ engine.tag }}
                        </span>
                      </div>
                      <p class="text-[11px] text-slate-500 truncate mt-0.5">
                        {{ engine.modelSnippet }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center pl-2">
                    <svg
                      *ngIf="selectedAiEngine === engine.id"
                      class="w-4 h-4 text-purple-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </button>
              </div>

              <!-- Footer Notice inside Panel -->
              <div class="p-2.5 bg-gradient-to-r from-emerald-50/80 via-teal-50/70 to-indigo-50/80 rounded-xl border border-emerald-200/60 text-[10px] text-emerald-900 flex items-start gap-2">
                <svg class="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>
                  <strong>Zero-Interruption Resilience:</strong> If your selected engine faces rate limits or demand spikes, remaining engines auto-take charge before falling back to local.
                </span>
              </div>
            </div>
          </div>

          <div *ngIf="selectedJobId" class="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <svg class="w-3.5 h-3.5 mr-1 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Target: &ge; {{ getSelectedJobThreshold() }}%
          </div>

          <label class="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-2xs cursor-pointer select-none">
            <input
              type="checkbox"
              [(ngModel)]="highMatchOnly"
              class="rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
            />
            <span>High Match Only</span>
          </label>

          <div class="flex items-center space-x-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Job:</label>
            <select
              [(ngModel)]="selectedJobId"
              (change)="onJobFilterChange()"
              class="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-brand-500 bg-white"
            >
              <option [ngValue]="null">All Job Postings</option>
              <option *ngFor="let job of myJobs" [ngValue]="job.id">
                {{ job.title }} ({{ job.applicantCount || 0 }})
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Applications Container -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        <div *ngIf="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
          <p class="mt-2 text-sm text-slate-500">Loading candidate applications...</p>
        </div>

        <div *ngIf="!loading && displayedApplications.length === 0" class="text-center py-20">
          <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <h3 class="text-base font-bold text-slate-800">No applications match your filter</h3>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {{ highMatchOnly ? 'No candidates meet the high compatibility threshold (' + getSelectedJobThreshold() + '%) for this selection.' : (selectedJobId ? 'No candidates have applied to this specific job yet.' : 'No candidates have submitted applications to your jobs yet.') }}
          </p>
        </div>

        <div *ngIf="!loading && displayedApplications.length > 0" class="divide-y divide-slate-100">
          <div
            *ngFor="let app of displayedApplications"
            class="p-6 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <!-- Left Info -->
            <div class="space-y-2 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                  {{ app.jobTitle }}
                </span>
                
                <!-- Match percentage badge if analyzed -->
                <span
                  *ngIf="app.hasAnalysis"
                  class="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-2xs"
                  [ngClass]="{
                    'bg-emerald-50 text-emerald-800 border-emerald-200': app.matchPercentage! >= (app.matchThreshold || 70),
                    'bg-indigo-50 text-indigo-800 border-indigo-200': app.matchPercentage! >= 50 && app.matchPercentage! < (app.matchThreshold || 70),
                    'bg-amber-50 text-amber-800 border-amber-200': app.matchPercentage! < 50
                  }"
                >
                  <svg *ngIf="app.matchPercentage! >= (app.matchThreshold || 70)" class="w-3 h-3 mr-1 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span *ngIf="app.matchPercentage! >= (app.matchThreshold || 70)">High Match ({{ app.matchPercentage }}% &ge; {{ app.matchThreshold || 70 }}%)</span>
                  <span *ngIf="app.matchPercentage! < (app.matchThreshold || 70)">{{ app.matchPercentage }}% Match (< {{ app.matchThreshold || 70 }}%)</span>
                </span>

                <span class="text-xs text-slate-400">
                  Applied {{ app.createdAt | date:'mediumDate' }}
                </span>
              </div>

              <!-- Candidate Name & Title -->
              <div>
                <h3 class="text-lg font-bold text-slate-900">
                  {{ app.candidateName || app.candidateEmail }}
                </h3>
                <p class="text-xs text-slate-600 font-medium">
                  {{ app.candidateEmail }}
                  <span *ngIf="app.candidateTitle">&bull; {{ app.candidateTitle }}</span>
                </p>
              </div>

              <!-- Candidate self-reported skills -->
              <div *ngIf="app.candidateSkills" class="text-xs text-slate-500">
                <strong class="text-slate-700">Documented Profile Skills:</strong> {{ app.candidateSkills }}
              </div>

              <!-- Cover note preview -->
              <div *ngIf="app.coverLetter" class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 italic">
                &ldquo;{{ app.coverLetter }}&rdquo;
              </div>

              <div class="text-xs text-slate-400">
                Document File: <strong class="text-slate-600">{{ app.cvOriginalName || 'Attached CV' }}</strong>
              </div>
            </div>

            <!-- Right Controls: Status & AI Action -->
            <div class="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 flex-shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              
              <!-- Status Dropdown -->
              <div class="flex items-center space-x-2 w-full sm:w-auto">
                <label class="text-xs font-semibold text-slate-500">Status:</label>
                <select
                  [ngModel]="app.status"
                  (ngModelChange)="updateStatus(app.id, $event)"
                  class="text-xs font-bold rounded-xl px-3 py-2 border border-slate-300 focus:ring-brand-500 bg-white"
                >
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW</option>
                  <option value="INTERVIEW">INTERVIEW</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center space-x-2 w-full sm:w-auto">
                <!-- Download CV -->
                <button
                  (click)="downloadCv(app.id, app.cvOriginalName)"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center"
                >
                  <svg class="w-3.5 h-3.5 mr-1 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download PDF
                </button>

                <!-- If already analyzed, offer View and Re-run with chosen model -->
                <div *ngIf="app.hasAnalysis" class="flex items-center space-x-2">
                  <button
                    (click)="viewAnalysis(app.id)"
                    class="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition flex items-center shadow-2xs"
                  >
                    <svg class="w-3.5 h-3.5 mr-1.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    View Match ({{ app.matchPercentage }}%)
                  </button>

                  <button
                    (click)="analyzeCv(app.id)"
                    [disabled]="analyzingAppId === app.id"
                    [title]="'Run analysis with ' + getAiLabel(selectedAiEngine)"
                    class="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 disabled:opacity-50 transition flex items-center"
                  >
                    <svg *ngIf="analyzingAppId !== app.id" class="w-3.5 h-3.5 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <svg *ngIf="analyzingAppId === app.id" class="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ analyzingAppId === app.id ? 'Running...' : 'Run ' + getAiLabel(selectedAiEngine) }}
                  </button>
                </div>

                <!-- Not yet analyzed: Run AI Analysis with selected engine -->
                <button
                  *ngIf="!app.hasAnalysis"
                  (click)="analyzeCv(app.id)"
                  [disabled]="analyzingAppId === app.id"
                  class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 hover:from-brand-700 hover:to-violet-700 shadow-md shadow-brand-500/20 disabled:opacity-50 transition flex items-center"
                >
                  <svg *ngIf="analyzingAppId !== app.id" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <svg *ngIf="analyzingAppId === app.id" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ analyzingAppId === app.id ? 'Analyzing...' : 'Analyze with ' + getAiLabel(selectedAiEngine) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Analysis Modal Component -->
      <app-ai-analysis-modal
        [analysis]="selectedAnalysis"
        (close)="selectedAnalysis = null"
      ></app-ai-analysis-modal>
    </div>
  `
})
export class RecruiterApplicationsComponent implements OnInit {
  applications: Application[] = [];
  myJobs: JobOffer[] = [];
  selectedJobId: number | null = null;
  loading = true;
  analyzingAppId: number | null = null;
  selectedAnalysis: CVAnalysis | null = null;
  highMatchOnly = false;

  selectedAiEngine: string = 'GEMINI';
  isAiDropdownOpen = false;

  aiEngines = [
    {
      id: 'GEMINI',
      name: 'Google Gemini',
      tag: 'Cloud LLM',
      modelSnippet: 'Gemini 2.5 / 1.5 Flash • Semantic matching',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconClass: 'bg-indigo-600 text-white'
    },
    {
      id: 'OLLAMA',
      name: 'Ollama (Local LLM)',
      tag: 'On-Device LLM',
      modelSnippet: 'Meta Llama 3.2 3B • 100% Offline & Private',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconClass: 'bg-emerald-600 text-white'
    },
    {
      id: 'GROQ',
      name: 'GroqCloud',
      tag: 'Ultra-Fast LPU',
      modelSnippet: 'OpenAI GPT OSS 120B / Llama 3.3 • 500+ tok/s',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
      iconClass: 'bg-orange-600 text-white'
    },
    {
      id: 'MISTRAL',
      name: 'Mistral AI / OpenRouter',
      tag: 'Dynamic Router',
      modelSnippet: 'Mistral Small & auto-routed free models',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      iconClass: 'bg-amber-600 text-white'
    },
    {
      id: 'LOCAL',
      name: 'Local Skill Engine',
      tag: 'Deterministic',
      modelSnippet: 'Apache PDFBox TF-IDF vector matching',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      iconClass: 'bg-slate-700 text-white'
    }
  ];

  selectAiEngine(engineId: string) {
    this.selectedAiEngine = engineId;
    this.isAiDropdownOpen = false;
  }

  getSelectedEngine() {
    return this.aiEngines.find(e => e.id === this.selectedAiEngine) || this.aiEngines[0];
  }

  getAiLabel(engine: string): string {
    switch (engine) {
      case 'OLLAMA': return 'Ollama (Local LLM)';
      case 'GROQ': return 'Groq';
      case 'MISTRAL': return 'Mistral / OpenRouter';
      case 'GEMINI': return 'Gemini';
      case 'LOCAL': return 'Local Engine';
      default: return engine;
    }
  }

  getSelectedJobThreshold(): number {
    if (!this.selectedJobId) return 70;
    const job = this.myJobs.find(j => j.id === this.selectedJobId);
    return job?.matchThreshold || 70;
  }

  get displayedApplications(): Application[] {
    if (!this.highMatchOnly) return this.applications;
    return this.applications.filter(a => (a.matchPercentage || 0) >= (a.matchThreshold || 70));
  }

  constructor(
    private recruiterService: RecruiterService,
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const routeJobId = this.route.snapshot.paramMap.get('jobId');
    if (routeJobId) {
      this.selectedJobId = Number(routeJobId);
    }

    this.loadJobs();
    this.loadApplications();
  }

  loadJobs() {
    this.recruiterService.getMyJobs().subscribe({
      next: (jobs) => this.myJobs = jobs
    });
  }

  loadApplications() {
    this.loading = true;
    const request$ = this.selectedJobId
      ? this.recruiterService.getJobApplications(this.selectedJobId)
      : this.recruiterService.getAllApplications();

    request$.subscribe({
      next: (apps) => {
        this.applications = apps;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error(err.error?.message || 'Failed to load candidate applications');
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/recruiter/jobs']);
        }
      }
    });
  }

  onJobFilterChange() {
    this.loadApplications();
  }

  updateStatus(appId: number, status: ApplicationStatus) {
    this.applicationService.updateStatus(appId, status).subscribe({
      next: () => {
        this.toastService.success(`Status updated to ${status}`, 'Updated');
        this.loadApplications();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Could not update status');
      }
    });
  }

  downloadCv(appId: number, filename?: string) {
    this.applicationService.downloadCv(appId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'Candidate_CV.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toastService.error('Could not download CV document')
    });
  }

  viewAnalysis(appId: number) {
    this.applicationService.getAnalysis(appId).subscribe({
      next: (analysis) => this.selectedAnalysis = analysis,
      error: () => this.analyzeCv(appId)
    });
  }

  analyzeCv(appId: number) {
    this.analyzingAppId = appId;
    const requestedLabel = this.getAiLabel(this.selectedAiEngine);
    this.applicationService.analyzeApplication(appId, this.selectedAiEngine).subscribe({
      next: (analysis) => {
        this.analyzingAppId = null;
        this.selectedAnalysis = analysis;
        const actualEngine = this.getAiLabel(analysis.aiProvider || this.selectedAiEngine);
        const failoverNotice = (analysis.aiProvider && analysis.aiProvider !== this.selectedAiEngine && analysis.aiProvider !== 'LOCAL')
          ? ` (auto-failover from ${requestedLabel})`
          : '';
        const timeBadge = analysis.executionTimeMs ? ` in ${this.formatExecutionTime(analysis.executionTimeMs)}` : '';
        this.toastService.success(`Analysis generated with ${actualEngine}${failoverNotice}${timeBadge}: ${analysis.matchPercentage}% overlap!`, 'Analysis Completed');
        this.loadApplications();
      },
      error: (err) => {
        this.analyzingAppId = null;
        this.toastService.error(err.error?.message || 'AI CV analysis failed');
      }
    });
  }

  formatExecutionTime(ms?: number): string {
    if (!ms && ms !== 0) return '';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }
}
