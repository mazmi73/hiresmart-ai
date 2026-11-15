import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CVAnalysis } from '../core/models/application.models';

@Component({
  selector: 'app-ai-analysis-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="analysis" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden transform transition-all animate-fadeIn">
        
        <!-- Header banner -->
        <div class="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 p-6 text-white flex items-start justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold tracking-tight">AI CV Skills Match Analysis</h3>
              <p class="text-xs text-indigo-100 flex flex-wrap items-center mt-0.5 gap-x-2 gap-y-1">
                <span>Provider: <strong class="uppercase font-semibold tracking-wider">{{ getProviderName(analysis.aiProvider) }}</strong></span>
                <span>&bull;</span>
                <span *ngIf="analysis.executionTimeMs">Execution Time: <strong class="font-bold text-amber-200">{{ formatExecutionTime(analysis.executionTimeMs) }}</strong></span>
                <span *ngIf="analysis.executionTimeMs">&bull;</span>
                <span>Documented overlap assessment</span>
              </p>
            </div>
          </div>
          <button (click)="close.emit()" class="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <!-- Match Score Overview -->
          <div class="flex flex-col sm:flex-row items-center justify-between p-5 rounded-xl bg-slate-50 border border-slate-200/80 gap-4">
            <div class="flex items-center space-x-5">
              <!-- Radial Progress Circle -->
              <div class="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    class="text-slate-200"
                    stroke-width="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    [ngClass]="{
                      'text-emerald-500': analysis.matchPercentage >= 70,
                      'text-brand-500': analysis.matchPercentage >= 50 && analysis.matchPercentage < 70,
                      'text-amber-500': analysis.matchPercentage < 50
                    }"
                    stroke-dasharray="100, 100"
                    [attr.stroke-dashoffset]="100 - analysis.matchPercentage"
                    stroke-width="3.5"
                    stroke-linecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-2xl font-black text-slate-800 tracking-tight">{{ analysis.matchPercentage }}%</span>
                  <span class="text-[9px] uppercase font-bold tracking-wider text-slate-600">Overlap</span>
                </div>
              </div>

              <div>
                <h4 class="text-base font-bold text-slate-900">Documented Skill Overlap</h4>
                <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                  Percentage of required job qualifications directly verified within the candidate's PDF CV document.
                </p>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span class="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {{ analysis.matchedSkills.length }} Matched
                  </span>
                  <span class="font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {{ analysis.missingSkills.length }} Missing
                  </span>
                  <span *ngIf="analysis.executionTimeMs" class="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-flex items-center gap-1 shadow-2xs">
                    <svg class="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Time: {{ formatExecutionTime(analysis.executionTimeMs) }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Matched Skills Section -->
          <div>
            <div class="flex items-center space-x-2 mb-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Documented & Matched Skills</h4>
            </div>
            <div *ngIf="analysis.matchedSkills.length > 0; else noMatched" class="flex flex-wrap gap-2">
              <span
                *ngFor="let skill of analysis.matchedSkills"
                class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm"
              >
                <svg class="w-3.5 h-3.5 mr-1.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                {{ skill }}
              </span>
            </div>
            <ng-template #noMatched>
              <p class="text-xs text-slate-600 italic">None of the required skills were detected in the CV.</p>
            </ng-template>
          </div>

          <!-- Missing Skills Section -->
          <div>
            <div class="flex items-center space-x-2 mb-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Required Skills Not Detected</h4>
            </div>
            <div *ngIf="analysis.missingSkills.length > 0; else noMissing" class="flex flex-wrap gap-2">
              <span
                *ngFor="let skill of analysis.missingSkills"
                class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 shadow-sm"
              >
                <svg class="w-3.5 h-3.5 mr-1.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                {{ skill }}
              </span>
            </div>
            <ng-template #noMissing>
              <p class="text-xs text-emerald-600 font-medium">All required skills are documented in the uploaded CV!</p>
            </ng-template>
          </div>

          <!-- All Extracted Skills from CV -->
          <div *ngIf="analysis.extractedSkills.length > 0">
            <div class="flex items-center space-x-2 mb-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wide">All Detected CV Skills ({{ analysis.extractedSkills.length }})</h4>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                *ngFor="let skill of analysis.extractedSkills"
                class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Explanation Details -->
          <div>
            <h4 class="text-sm font-bold text-slate-800 mb-2">Plain-Language Assessment</h4>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-mono">
              {{ analysis.explanation }}
            </div>
          </div>

          <!-- Ethical AI Notice -->
          <div class="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-3 text-xs text-amber-900">
            <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="font-bold">Ethical AI & Decision Support Policy</p>
              <p class="mt-0.5 text-amber-800 leading-normal">
                This algorithm assists recruiters by indexing documented keywords. It never automatically rejects candidates, ranks applicants based on demographic characteristics, or substitutes human evaluation.
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            (click)="close.emit()"
            class="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  `
})
export class AiAnalysisModalComponent {
  @Input() analysis: CVAnalysis | null = null;
  @Output() close = new EventEmitter<void>();

  getProviderName(provider: string): string {
    switch (provider) {
      case 'OLLAMA': return 'Ollama (Local Llama 3.2)';
      case 'GROQ': return 'Groq (Ultra-Fast LPU)';
      case 'MISTRAL': return 'Mistral AI';
      case 'GEMINI': return 'Google Gemini';
      default: return 'Local Skill Engine';
    }
  }

  formatExecutionTime(ms?: number): string {
    if (!ms && ms !== 0) return '';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }
}
