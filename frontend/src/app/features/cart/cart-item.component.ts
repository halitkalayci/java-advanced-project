import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiButton } from '../../shared/ui';
import { CartItem, CartService } from '../../core';
import { UiToastService } from '../../shared/ui/toast.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UiButton],
  template: `
    <div class="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900">
      <!-- Product Image -->
      <div class="flex-shrink-0">
        <a [routerLink]="['/product', item.productId]" class="block">
          <div class="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img 
              [src]="item.product.imageUrl" 
              [alt]="item.product.name"
              class="w-full h-full object-cover"
              (error)="onImageError($event)"
            />
          </div>
        </a>
      </div>

      <!-- Product Info -->
      <div class="flex-1 min-w-0">
        <a [routerLink]="['/product', item.productId]" class="block hover:text-indigo-600 dark:hover:text-indigo-400">
          <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
            {{ item.product.name }}
          </h3>
        </a>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ item.unitPrice | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }} / adet
        </p>
      </div>

      <!-- Quantity Controls -->
      <div class="flex items-center gap-3">
        <div class="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg">
          <button 
            (click)="decreaseQuantity()"
            [disabled]="isUpdating || item.quantity <= 1"
            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
            </svg>
          </button>
          <input 
            [value]="item.quantity"
            type="number"
            min="1"
            [max]="item.product.stock"
            class="w-12 text-center border-0 bg-transparent focus:outline-none text-sm"
            (change)="onQuantityChange($event)"
            [disabled]="isUpdating"
          />
          <button 
            (click)="increaseQuantity()"
            [disabled]="isUpdating || item.quantity >= item.product.stock"
            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Total Price -->
      <div class="text-right">
        <p class="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {{ item.totalPrice | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
        </p>
      </div>

      <!-- Remove Button -->
      <div class="flex-shrink-0">
        <ui-button 
          variant="ghost" 
          size="sm"
          (click)="removeItem()"
          [isDisabled]="isRemoving"
          class="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
        >
          @if (isRemoving) {
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          } @else {
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          }
        </ui-button>
      </div>
    </div>
  `,
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() updated = new EventEmitter<void>();
  @Output() removed = new EventEmitter<void>();

  private cartService = inject(CartService);
  private toastService = inject(UiToastService);

  isUpdating = false;
  isRemoving = false;

  increaseQuantity() {
    if (this.item.quantity >= this.item.product.stock || this.isUpdating) {
      return;
    }
    this.updateQuantity(this.item.quantity + 1);
  }

  decreaseQuantity() {
    if (this.item.quantity <= 1 || this.isUpdating) {
      return;
    }
    this.updateQuantity(this.item.quantity - 1);
  }

  onQuantityChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const newQuantity = parseInt(target.value);
    
    if (isNaN(newQuantity) || newQuantity < 1) {
      target.value = this.item.quantity.toString();
      return;
    }
    
    if (newQuantity > this.item.product.stock) {
      target.value = this.item.product.stock.toString();
      this.updateQuantity(this.item.product.stock);
      return;
    }
    
    if (newQuantity !== this.item.quantity) {
      this.updateQuantity(newQuantity);
    }
  }

  private updateQuantity(newQuantity: number) {
    this.isUpdating = true;
    
    this.cartService.updateItem(this.item.id, newQuantity).subscribe({
      next: () => {
        this.toastService.success('Sepet güncellendi');
        this.updated.emit();
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating cart item:', error);
        this.toastService.error('Sepet güncellenirken hata oluştu');
        this.isUpdating = false;
      }
    });
  }

  removeItem() {
    if (this.isRemoving) return;
    
    this.isRemoving = true;
    
    this.cartService.removeItem(this.item.id).subscribe({
      next: () => {
        this.toastService.success(`${this.item.product.name} sepetten kaldırıldı`);
        this.removed.emit();
        this.isRemoving = false;
      },
      error: (error) => {
        console.error('Error removing cart item:', error);
        this.toastService.error('Ürün sepetten kaldırılırken hata oluştu');
        this.isRemoving = false;
      }
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNEg0OFY1NkgzMlYyNFoiIGZpbGw9IiM5Q0E0QjQiLz4KPHN2Zz4K';
  }
}
