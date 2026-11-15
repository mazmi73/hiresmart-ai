import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private counter = 0;
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  show(type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string, durationMs = 4500) {
    const id = ++this.counter;
    const newToast: ToastMessage = { id, type, message, title };
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, durationMs);
  }

  success(message: string, title = 'Success') {
    this.show('success', message, title);
  }

  error(message: string, title = 'Error') {
    this.show('error', message, title);
  }

  info(message: string, title = 'Notice') {
    this.show('info', message, title);
  }

  warning(message: string, title = 'Warning') {
    this.show('warning', message, title);
  }

  remove(id: number) {
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next(current.filter(t => t.id !== id));
  }
}
