import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      <div
        *ngFor="let toast of toastService.toasts$ | async"
        class="pointer-events-auto transform transition-all duration-300 ease-out shadow-xl rounded-xl p-4 border flex items-start space-x-3 bg-white"
        [ngClass]="{
          'border-emerald-200 text-emerald-900 bg-emerald-50/95': toast.type === 'success',
          'border-rose-200 text-rose-900 bg-rose-50/95': toast.type === 'error',
          'border-indigo-200 text-indigo-900 bg-indigo-50/95': toast.type === 'info',
          'border-amber-200 text-amber-900 bg-amber-50/95': toast.type === 'warning'
        }"
      >
        <!-- Icon -->
        <div class="flex-shrink-0 mt-0.5">
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg *ngIf="toast.type === 'warning'" class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>

        <div class="flex-1 text-sm">
          <p *ngIf="toast.title" class="font-semibold mb-0.5">{{ toast.title }}</p>
          <p class="opacity-90 leading-relaxed">{{ toast.message }}</p>
        </div>

        <button (click)="toastService.remove(toast.id)" class="text-slate-400 hover:text-slate-600 p-1">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
