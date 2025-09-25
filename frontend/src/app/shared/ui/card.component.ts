import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <ng-content />
    </div>
  `,
})
export class UiCard {}

@Component({
  selector: 'ui-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 pb-0">
      <ng-content />
    </div>
  `,
})
export class UiCardHeader {}

@Component({
  selector: 'ui-card-body',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <ng-content />
    </div>
  `,
})
export class UiCardBody {}

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 pt-0">
      <ng-content />
    </div>
  `,
})
export class UiCardFooter {}

@Component({
  selector: 'ui-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
      <ng-content />
    </h3>
  `,
})
export class UiCardTitle {}

@Component({
  selector: 'ui-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
      <ng-content />
    </p>
  `,
})
export class UiCardDescription {}
