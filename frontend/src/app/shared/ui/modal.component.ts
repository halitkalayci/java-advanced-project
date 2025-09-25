import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          (click)="onBackdropClick()"
        ></div>
        
        <!-- Modal -->
        <div 
          class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md max-h-[90vh] overflow-y-auto m-4"
          (click)="$event.stopPropagation()"
        >
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class UiModal {
  @Input() isOpen = false;
  @Input() closeOnBackdrop = true;
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isOpen) {
      this.close.emit();
    }
  }

  onBackdropClick() {
    if (this.closeOnBackdrop) {
      this.close.emit();
    }
  }
}

@Component({
  selector: 'ui-modal-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
      <ng-content />
      <button 
        (click)="close.emit()"
        class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `,
})
export class UiModalHeader {
  @Output() close = new EventEmitter<void>();
}

@Component({
  selector: 'ui-modal-body',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <ng-content />
    </div>
  `,
})
export class UiModalBody {}

@Component({
  selector: 'ui-modal-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
      <ng-content />
    </div>
  `,
})
export class UiModalFooter {}

@Component({
  selector: 'ui-modal-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
      <ng-content />
    </h2>
  `,
})
export class UiModalTitle {}
