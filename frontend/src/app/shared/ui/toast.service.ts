import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UiToastService {
  toasts = signal<Toast[]>([]);

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addToast(type: Toast['type'], message: string, duration = 5000) {
    const id = this.generateId();
    const toast: Toast = { id, type, message, duration };
    
    this.toasts.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, duration?: number) {
    this.addToast('success', message, duration);
  }

  error(message: string, duration?: number) {
    this.addToast('error', message, duration);
  }

  info(message: string, duration?: number) {
    this.addToast('info', message, duration);
  }

  warning(message: string, duration?: number) {
    this.addToast('warning', message, duration);
  }

  remove(id: string) {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }
}
