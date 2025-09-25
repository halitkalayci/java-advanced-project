import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core';
import { ProductCardComponent } from './product-card.component';
import { UiSkeletonCard } from '../../shared/ui';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, UiSkeletonCard],
  template: `
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      @if (isLoading) {
        @for (item of [1,2,3,4,5,6,7,8]; track item) {
          <ui-skeleton-card />
        }
      } @else {
        @for (product of products; track product.id) {
          <app-product-card [product]="product" />
        } @empty {
          <div class="col-span-full flex flex-col items-center justify-center py-12">
            <svg class="w-16 h-16 text-slate-400 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
            </svg>
            <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              Ürün bulunamadı
            </h3>
            <p class="text-slate-600 dark:text-slate-400 text-center max-w-md">
              Aradığınız kriterlere uygun ürün bulunamadı. Lütfen farklı arama terimleri deneyin.
            </p>
          </div>
        }
      }
    </div>
  `,
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
  @Input() isLoading = false;
}
