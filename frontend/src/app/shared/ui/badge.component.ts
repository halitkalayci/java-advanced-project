import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses()">
      <ng-content />
    </span>
  `,
})
export class UiBadge {
  @Input() variant: BadgeVariant = 'default';

  badgeClasses() {
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    
    const variantClasses = {
      default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    };

    return `${baseClasses} ${variantClasses[this.variant]}`;
  }
}
