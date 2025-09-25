import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiButton } from '../../shared/ui';
import { Product, CartService } from '../../core';
import { UiToastService } from '../../shared/ui/toast.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, UiButton],
  template: `
    <article class="group rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <a [routerLink]="['/product', product.id]" class="block">
        <div class="aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
          @if (!imageLoaded) {
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="animate-pulse bg-slate-200 dark:bg-slate-700 w-16 h-16 rounded-lg"></div>
            </div>
          }
          <img 
            [src]="product.imageUrl" 
            [alt]="product.name" 
            [class]="'w-full h-full object-cover group-hover:scale-105 transition-all duration-200 ' + (imageLoaded ? 'opacity-100' : 'opacity-0')"
            loading="eager"
            (load)="onImageLoad($event)"
            (error)="onImageError($event)"
          />
        </div>
        <div class="mt-3">
          <h3 class="text-sm font-medium line-clamp-2 text-slate-900 dark:text-slate-100">
            {{ product.name }}
          </h3>
          <p class="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
            {{ product.price | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
          </p>
          @if (product.stock <= 0) {
            <p class="mt-1 text-xs text-red-600 dark:text-red-400">Stokta Yok</p>
          } @else if (product.stock <= 10) {
            <p class="mt-1 text-xs text-orange-600 dark:text-orange-400">
              Son {{ product.stock }} adet
            </p>
          }
        </div>
      </a>
      <ui-button 
        (click)="addToCart()"
        [isDisabled]="product.stock <= 0 || isAddingToCart"
        variant="primary"
        class="mt-3 w-full"
      >
        @if (isAddingToCart) {
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Ekleniyor...
        } @else {
          @if (product.stock <= 0) {
            Stokta Yok
          } @else {
            Sepete Ekle
          }
        }
      </ui-button>
    </article>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private cartService = inject(CartService);
  private toastService = inject(UiToastService);

  isAddingToCart = false;
  imageLoaded = false;

  addToCart() {
    if (this.product.stock <= 0 || this.isAddingToCart) {
      return;
    }

    this.isAddingToCart = true;
    
    this.cartService.addItem(this.product.id, 1).subscribe({
      next: () => {
        this.toastService.success(`${this.product.name} sepete eklendi`);
        this.isAddingToCart = false;
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.toastService.error('Ürün sepete eklenirken hata oluştu');
        this.isAddingToCart = false;
      }
    });
  }

  onImageLoad(event: Event) {
    this.imageLoaded = true;
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    this.imageLoaded = true; // Error durumunda da loading'i bitir
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBWMTQwSDgwVjYwWiIgZmlsbD0iIzlCA0E0QjQiLz4KPHN2Zz4K';
  }
}
