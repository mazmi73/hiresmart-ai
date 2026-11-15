import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-white border-t border-slate-200 mt-auto py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 space-y-4 md:space-y-0">
        <div class="flex items-center space-x-3">
          <div class="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <span class="font-semibold text-slate-800">HireSmart AI</span>
          <span>&bull;</span>
          <span>Intelligent Recruitment Platform</span>
        </div>

        <div class="flex items-center space-x-6 text-xs text-slate-500">
          <span>&copy; {{ currentYear }} HireSmart AI. All rights reserved.</span>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
