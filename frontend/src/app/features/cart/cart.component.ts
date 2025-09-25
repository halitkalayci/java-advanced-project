import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiButton } from '../../shared/ui';
import { Cart, CartService } from '../../core';
import { CartItemComponent } from './cart-item.component';
import { CartSummaryComponent } from './cart-summary.component';
import { UiToastService } from '../../shared/ui/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    UiButton,
    CartItemComponent,
    CartSummaryComponent
  ],
  template: `
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Sepetim
        </h1>
        @if (cart() && cart()!.items.length > 0) {
          <p class="text-slate-600 dark:text-slate-400 mt-2">
            {{ cart()!.items.length }} ürün sepetinizde bulunuyor
          </p>
        }
      </div>

      @if (isLoading()) {
        <!-- Loading State -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-4">
            @for (item of [1,2,3]; track item) {
              <div class="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
            }
          </div>
          <div>
            <div class="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          </div>
        </div>
      } @else if (cart() && cart()!.items.length > 0) {
        <!-- Cart Items -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Items List -->
          <div class="lg:col-span-2">
            <div class="space-y-4">
              <!-- Clear Cart Button -->
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Sepet İçeriği
                </h2>
                <ui-button 
                  variant="ghost" 
                  size="sm"
                  (click)="clearCart()"
                  [isDisabled]="isClearingCart"
                  class="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  @if (isClearingCart) {
                    <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Temizleniyor...
                  } @else {
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Sepeti Temizle
                  }
                </ui-button>
              </div>

              <!-- Cart Items -->
              @for (item of cart()!.items; track item.id) {
                <app-cart-item 
                  [item]="item"
                  (updated)="onItemUpdated()"
                  (removed)="onItemRemoved()"
                />
              }
            </div>
          </div>

          <!-- Cart Summary -->
          <div>
            <app-cart-summary [cart]="cart()" />
          </div>
        </div>
      } @else {
        <!-- Empty Cart -->
        <div class="text-center py-16">
          <div class="max-w-md mx-auto">
            <svg class="w-24 h-24 text-slate-300 dark:text-slate-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h14M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4"></path>
            </svg>
            
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Sepetiniz boş
            </h2>
            
            <p class="text-slate-600 dark:text-slate-400 mb-8">
              Henüz sepetinize ürün eklememişsiniz. Keşfetmeye başlayın ve beğendiğiniz ürünleri sepetinize ekleyin.
            </p>
            
            <div class="space-y-3">
              <ui-button 
                routerLink="/"
                variant="primary" 
                size="lg"
                class="w-full"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Ürünleri Keşfet
              </ui-button>
              
              <ui-button 
                routerLink="/orders"
                variant="ghost"
                class="w-full"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Geçmiş Siparişlerim
              </ui-button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private toastService = inject(UiToastService);

  cart = signal<Cart | null>(null);
  isLoading = signal(true);
  isClearingCart = false;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading.set(true);
    
    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cart.set(response.data || null);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.cart.set(null);
        this.isLoading.set(false);
      }
    });
  }

  onItemUpdated() {
    // Cart will be updated automatically via the service
    // but we can reload to ensure consistency
    this.loadCart();
  }

  onItemRemoved() {
    // Cart will be updated automatically via the service
    // but we can reload to ensure consistency
    this.loadCart();
  }

  clearCart() {
    if (this.isClearingCart) return;
    
    this.isClearingCart = true;
    
    this.cartService.clearCart().subscribe({
      next: () => {
        this.toastService.success('Sepet temizlendi');
        this.cart.set(null);
        this.isClearingCart = false;
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.toastService.error('Sepet temizlenirken hata oluştu');
        this.isClearingCart = false;
      }
    });
  }
}
