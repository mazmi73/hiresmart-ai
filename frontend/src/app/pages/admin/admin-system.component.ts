import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';
import { SystemConfig, SystemTelemetry } from '../../core/models/admin.models';

@Component({
  selector: 'app-admin-system',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <!-- Header & Breadcrumbs -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <a routerLink="/admin/dashboard" class="hover:text-brand-600">&larr; Admin Dashboard</a>
            <span>/</span>
            <span>Platform Operations</span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">System Configuration & Telemetry</h1>
          <p class="text-xs text-slate-500 mt-0.5">Configure global AI matching parameters, upload thresholds, and inspect real-time JVM / Database telemetry</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            (click)="loadData()"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-sm inline-flex items-center"
          >
            <svg class="w-3.5 h-3.5 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Telemetry
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
        <p class="mt-2 text-sm text-slate-500">Querying platform telemetry & configurations...</p>
      </div>

      <!-- Main Content -->
      <div *ngIf="!loading" class="space-y-8">

        <!-- Real-Time Telemetry Cards -->
        <div>
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Runtime Telemetry & Architecture</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <!-- Database Health -->
            <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase">Database</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                  Connected
                </span>
              </div>
              <p class="text-xl font-black text-slate-900 mt-2">PostgreSQL 16</p>
              <p class="text-xs text-slate-500 mt-1">ACID transactional integrity via HikariCP</p>
            </div>

            <!-- JVM Heap Memory -->
            <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase">JVM Heap Memory</span>
                <span class="text-xs font-mono font-bold text-slate-700">{{ telemetry?.jvmUsedMemoryMb }} / {{ telemetry?.jvmMaxMemoryMb }} MB</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  class="bg-brand-600 h-2 rounded-full transition-all"
                  [style.width.%]="(telemetry?.jvmUsedMemoryMb || 1) / (telemetry?.jvmMaxMemoryMb || 1) * 100"
                ></div>
              </div>
              <p class="text-xs text-slate-500 mt-2">Java 21 Virtual Machine (Eclipse Temurin)</p>
            </div>

            <!-- Multi-Model AI Orchestrator -->
            <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase">AI Orchestrator</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  Multi-Provider
                </span>
              </div>
              <p class="text-xl font-black text-slate-900 mt-2">
                Multi-Model Hub
              </p>
              <p class="text-xs text-slate-500 mt-1">
                Gemini, Groq (Llama 3.3), Mistral AI & Local (Selected on-demand by Recruiters)
              </p>
            </div>

            <!-- Storage & Uptime -->
            <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-500 uppercase">Uptime & Storage</span>
                <span class="text-xs font-mono text-slate-700">{{ telemetry?.uptimeSeconds }}s</span>
              </div>
              <p class="text-xl font-black text-slate-900 mt-2">{{ telemetry?.uploadedCvsCount }} Documents</p>
              <p class="text-xs text-slate-500 mt-1">Stored in Docker volume (cv_uploads)</p>
            </div>

          </div>
        </div>

        <!-- AI Providers & API Keys Management Section -->
        <div class="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div class="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                </span>
                <h2 class="text-lg font-bold text-slate-900">AI Provider Engines & Free-Tier API Keys</h2>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                Configure platform API keys for free-tier Cloud AI models. Recruiters dynamically select which AI engine to use for candidate CV matching.
              </p>
            </div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 text-xs font-medium border border-purple-200">
              <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              Recruiter-Selected Free AI Engines
            </div>
          </div>

          <!-- 3 API Key Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <!-- 1. Google Gemini -->
            <div class="bg-gradient-to-b from-indigo-50/60 to-white rounded-2xl p-5 border border-indigo-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      G
                    </div>
                    <div>
                      <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Google Gemini</h3>
                      <p class="text-[11px] text-slate-500">Gemini 2.5 / 1.5 Flash (15 RPM Free)</p>
                    </div>
                  </div>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    [ngClass]="configMap['GEMINI_API_KEY']?.trim() ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'"
                  >
                    {{ configMap['GEMINI_API_KEY']?.trim() ? 'Configured' : 'Not Configured' }}
                  </span>
                </div>

                <div class="mt-4 space-y-1.5">
                  <label class="block text-[11px] font-bold text-indigo-950 uppercase tracking-wider">
                    API Key
                  </label>
                  <input
                    type="password"
                    [(ngModel)]="configMap['GEMINI_API_KEY']"
                    placeholder="AIzaSy... API key"
                    class="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                  <p class="text-[11px] text-slate-500 leading-snug pt-1">
                    Google AI Studio cloud generative engine for fast semantic CV matching.
                  </p>
                </div>
              </div>

              <div class="pt-2 border-t border-indigo-100/80">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-1"
                >
                  <span>Get Free Key at Google AI Studio &rarr;</span>
                </a>
              </div>
            </div>

            <!-- 2. Groq (Meta Llama 3.3 70B) -->
            <div class="bg-gradient-to-b from-orange-50/60 to-white rounded-2xl p-5 border border-orange-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      GQ
                    </div>
                    <div>
                      <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">GroqCloud</h3>
                      <p class="text-[11px] text-slate-500">Meta Llama 3.3 70B (30 RPM Free)</p>
                    </div>
                  </div>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    [ngClass]="configMap['GROQ_API_KEY']?.trim() ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'"
                  >
                    {{ configMap['GROQ_API_KEY']?.trim() ? 'Configured' : 'Not Configured' }}
                  </span>
                </div>

                <div class="mt-4 space-y-1.5">
                  <label class="block text-[11px] font-bold text-orange-950 uppercase tracking-wider">
                    API Key
                  </label>
                  <input
                    type="password"
                    [(ngModel)]="configMap['GROQ_API_KEY']"
                    placeholder="gsk_... API key"
                    class="w-full px-3 py-2 rounded-xl border border-orange-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
                  />
                  <p class="text-[11px] text-slate-500 leading-snug pt-1">
                    Ultra-fast LPU inference (500+ tok/s). 30 requests/min and 14,400 requests/day 100% free forever.
                  </p>
                </div>
              </div>

              <div class="pt-2 border-t border-orange-100/80">
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[11px] font-bold text-orange-700 hover:text-orange-900 underline inline-flex items-center gap-1"
                >
                  <span>Get Free Key at GroqCloud &rarr;</span>
                </a>
              </div>
            </div>

            <!-- 3. Mistral AI (or OpenRouter) -->
            <div class="bg-gradient-to-b from-amber-50/60 to-white rounded-2xl p-5 border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      M
                    </div>
                    <div>
                      <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Mistral AI</h3>
                      <p class="text-[11px] text-slate-500">Mistral Small / OpenRouter (Free)</p>
                    </div>
                  </div>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    [ngClass]="configMap['MISTRAL_API_KEY']?.trim() ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'"
                  >
                    {{ configMap['MISTRAL_API_KEY']?.trim() ? 'Configured' : 'Not Configured' }}
                  </span>
                </div>

                <div class="mt-4 space-y-1.5">
                  <label class="block text-[11px] font-bold text-amber-950 uppercase tracking-wider">
                    API Key
                  </label>
                  <input
                    type="password"
                    [(ngModel)]="configMap['MISTRAL_API_KEY']"
                    placeholder="Mistral or OpenRouter (sk-or-...) key"
                    class="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                  <p class="text-[11px] text-slate-500 leading-snug pt-1">
                    Free Experimentation tier on Mistral. Also supports OpenRouter free models (DeepSeek R1 / Llama 3.3).
                  </p>
                </div>
              </div>

              <div class="pt-2 border-t border-amber-100/80 flex items-center justify-between">
                <a
                  href="https://console.mistral.ai/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline inline-flex items-center gap-1"
                >
                  <span>Mistral Key &rarr;</span>
                </a>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-1"
                >
                  <span>OpenRouter &rarr;</span>
                </a>
              </div>
            </div>

          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <svg class="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>
              <strong>Zero-Disruption Fallback:</strong> If any configured AI key is missing, expired, or reaches rate limits, HireSmart AI automatically falls back to the deterministic Local Engine (Apache PDFBox) with a helpful notice.
            </span>
          </div>
        </div>

        <!-- Global Platform Configurations -->
        <div class="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <h2 class="text-lg font-bold text-slate-900">Platform Governance Parameters</h2>
            <p class="text-xs text-slate-500 mt-0.5">Modify operational rules and system parameters in real time</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- Max Upload Size -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Maximum CV Upload Size (MB)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                [(ngModel)]="configMap['MAX_CV_SIZE_MB']"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p class="text-xs text-slate-500 mt-1">Enforced by Spring Boot multipart filter and Nginx reverse proxy.</p>
            </div>

            <!-- Allowed Extensions -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Allowed Document Extensions
                </label>
                <span class="text-[10px] text-slate-400 font-medium">Comma-separated</span>
              </div>
              <input
                type="text"
                [(ngModel)]="configMap['ALLOWED_EXTENSIONS']"
                placeholder="pdf, doc, docx, txt, rtf, odt"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
              />

              <!-- Quick extension toggles -->
              <div class="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span class="text-[11px] text-slate-500 font-medium mr-1">Quick Toggle:</span>
                <button
                  *ngFor="let ext of availableExtensions"
                  type="button"
                  (click)="toggleExtension(ext)"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                  [ngClass]="hasExtension(ext)
                    ? 'bg-brand-50 text-brand-700 border border-brand-300 shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 opacity-60'"
                >
                  <span *ngIf="hasExtension(ext)" class="text-brand-600 font-bold">&check;</span>
                  .{{ ext }}
                </button>
              </div>

              <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Supported formats: PDF (Apache PDFBox parser), Word (.doc, .docx), Plain text (.txt), Rich Text (.rtf), OpenDocument (.odt). Candidates can submit resumes in any enabled format.
              </p>
            </div>

          </div>

          <!-- Save Button -->
          <div class="pt-4 flex justify-end">
            <button
              (click)="saveConfigurations()"
              [disabled]="saving"
              class="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition shadow-sm inline-flex items-center"
            >
              <svg *ngIf="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ saving ? 'Saving Changes...' : 'Save System Configurations' }}
            </button>
          </div>
        </div>

      </div>

    </div>
  `
})
export class AdminSystemComponent implements OnInit {
  configs: SystemConfig[] = [];
  configMap: { [key: string]: string } = {};
  telemetry: SystemTelemetry | null = null;
  loading = true;
  saving = false;
  availableExtensions: string[] = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  hasExtension(ext: string): boolean {
    const current = (this.configMap['ALLOWED_EXTENSIONS'] || '')
      .toLowerCase()
      .split(',')
      .map(e => e.trim().replace(/^\./, ''));
    return current.includes(ext.toLowerCase());
  }

  toggleExtension(ext: string): void {
    const current = (this.configMap['ALLOWED_EXTENSIONS'] || '')
      .toLowerCase()
      .split(',')
      .map(e => e.trim().replace(/^\./, ''))
      .filter(e => e.length > 0);

    const target = ext.toLowerCase().replace(/^\./, '');
    const index = current.indexOf(target);
    if (index > -1) {
      if (current.length === 1) {
        this.toastService.warning('At least one document extension must remain enabled.');
        return;
      }
      current.splice(index, 1);
    } else {
      current.push(target);
    }
    this.configMap['ALLOWED_EXTENSIONS'] = current.join(', ');
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.adminService.getSystemConfig().subscribe({
      next: (res) => {
        this.configs = res.configs;
        this.telemetry = res.telemetry;
        this.configMap = {};
        for (const c of res.configs) {
          this.configMap[c.configKey] = c.configValue;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Failed to load system configuration');
      }
    });
  }

  saveConfigurations() {
    this.saving = true;
    const keys = Object.keys(this.configMap).filter(k => k !== 'REGISTRATION_OPEN' && k !== 'MAINTENANCE_MODE');
    if (keys.length === 0) {
      this.saving = false;
      return;
    }
    let completed = 0;

    for (const key of keys) {
      this.adminService.updateSystemConfig(key, this.configMap[key]).subscribe({
        next: () => {
          completed++;
          if (completed === keys.length) {
            this.saving = false;
            this.toastService.success('All system configurations updated and logged to audit trail.', 'Settings Saved');
            this.loadData();
          }
        },
        error: () => {
          this.saving = false;
          this.toastService.error(`Could not update config: ${key}`);
        }
      });
    }
  }
}
