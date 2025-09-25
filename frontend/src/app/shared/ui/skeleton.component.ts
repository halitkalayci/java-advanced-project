import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [class]="skeletonClasses()"
      [style.width]="width"
      [style.height]="height"
    ></div>
  `,
})
export class UiSkeleton {
  @Input() width = '100%';
  @Input() height = '20px';
  @Input() rounded = true;

  skeletonClasses() {
    const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-700';
    const roundedClass = this.rounded ? 'rounded' : '';
    
    return `${baseClasses} ${roundedClass}`;
  }
}

@Component({
  selector: 'ui-skeleton-card',
  standalone: true,
  imports: [CommonModule, UiSkeleton],
  template: `
    <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
      <ui-skeleton height="200px" [rounded]="true" />
      <div class="space-y-2">
        <ui-skeleton height="20px" width="80%" />
        <ui-skeleton height="16px" width="60%" />
      </div>
      <ui-skeleton height="40px" width="100%" />
    </div>
  `,
})
export class UiSkeletonCard {}
