import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiButton, UiCard, UiCardHeader, UiCardBody, UiCardTitle } from '../../shared/ui';
import { Cart } from '../../core';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule, RouterModule, UiButton, UiCard, UiCardHeader, UiCardBody, UiCardTitle],
  template: `
    <ui-card class="sticky top-4">
      <ui-card-header>
        <ui-card-title>Sipariş Özeti</ui-card-title>
      </ui-card-header>
      
      <ui-card-body class="space-y-4">
        <!-- Items Summary -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-slate-600 dark:text-slate-400">
              Ürünler ({{ getTotalItems() }} adet)
            </span>
            <span class="text-slate-900 dark:text-slate-100">
              {{ getSubtotal() | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
            </span>
          </div>
          
          <div class="flex justify-between text-sm">
            <span class="text-slate-600 dark:text-slate-400">KDV (%18)</span>
            <span class="text-slate-900 dark:text-slate-100">
              {{ getVat() | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
            </span>
          </div>
          
          <div class="flex justify-between text-sm">
            <span class="text-slate-600 dark:text-slate-400">Kargo</span>
            <span class="text-green-600 dark:text-green-400 font-medium">
              Ücretsiz
            </span>
          </div>
        </div>
        
        <!-- Divider -->
        <hr class="border-slate-200 dark:border-slate-700">
        
        <!-- Total -->
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Toplam
          </span>
          <span class="text-xl font-bold text-slate-900 dark:text-slate-100">
            {{ cart?.totalAmount | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
          </span>
        </div>
        
        <!-- Checkout Button -->
        <ui-button 
          routerLink="/checkout"
          variant="primary" 
          size="lg"
          class="w-full"
          [isDisabled]="!cart || cart.items.length === 0"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Siparişi Tamamla
        </ui-button>
        
        <!-- Continue Shopping -->
        <ui-button 
          routerLink="/"
          variant="ghost" 
          class="w-full"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Alışverişe Devam Et
        </ui-button>
        
        <!-- Security Badges -->
        <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>Güvenli ödeme</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>30 gün iade garantisi</span>
          </div>
        </div>
      </ui-card-body>
    </ui-card>
  `,
})
export class CartSummaryComponent {
  @Input() cart: Cart | null = null;

  getTotalItems(): number {
    return this.cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  getSubtotal(): number {
    if (!this.cart?.totalAmount) return 0;
    // Remove VAT from total to get subtotal
    return this.cart.totalAmount / 1.18;
  }

  getVat(): number {
    return this.getSubtotal() * 0.18;
  }
}
