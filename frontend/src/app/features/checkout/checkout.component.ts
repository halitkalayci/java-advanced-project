import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UiButton, UiInput, UiCard, UiCardHeader, UiCardBody, UiCardTitle } from '../../shared/ui';
import { Cart, CartService, OrderService, CreateOrderRequest, ShippingAddress } from '../../core';
import { UiToastService } from '../../shared/ui/toast.service';
import { TURKISH_CITIES } from '../../core/cities';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    UiButton, 
    UiInput, 
    UiCard, 
    UiCardHeader, 
    UiCardBody, 
    UiCardTitle
  ],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Sipariş Tamamla
        </h1>
        <p class="text-slate-600 dark:text-slate-400 mt-2">
          Teslimat bilgilerinizi girin ve siparişinizi tamamlayın
        </p>
      </div>

      @if (isLoading()) {
        <!-- Loading State -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          </div>
          <div>
            <div class="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          </div>
        </div>
      } @else if (cart() && cart()!.items.length > 0) {
        <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Shipping Address Form -->
            <div>
              <ui-card>
                <ui-card-header>
                  <ui-card-title>Teslimat Adresi</ui-card-title>
                </ui-card-header>
                
                <ui-card-body class="space-y-4">
                  <!-- Name Fields -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ui-input
                      label="Ad"
                      placeholder="Adınız"
                      [required]="true"
                      [error]="getFieldError('firstName')"
                      formControlName="firstName"
                    />
                    <ui-input
                      label="Soyad"
                      placeholder="Soyadınız"
                      [required]="true"
                      [error]="getFieldError('lastName')"
                      formControlName="lastName"
                    />
                  </div>

                  <!-- Address Fields -->
                  <ui-input
                    label="Adres Satırı 1"
                    placeholder="Sokak, mahalle, kapı no"
                    [required]="true"
                    [error]="getFieldError('addressLine1')"
                    formControlName="addressLine1"
                  />
                  
                  <ui-input
                    label="Adres Satırı 2"
                    placeholder="Daire no, blok, vb. (isteğe bağlı)"
                    formControlName="addressLine2"
                  />

                  <!-- City and Postal Code -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Şehir <span class="text-red-500">*</span>
                      </label>
                      <select 
                        formControlName="city"
                        class="w-full h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        [class.border-red-300]="getFieldError('city')"
                      >
                        <option value="">Şehir seçin</option>
                        @for (city of cities; track city) {
                          <option [value]="city">{{ city }}</option>
                        }
                      </select>
                      @if (getFieldError('city')) {
                        <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ getFieldError('city') }}</p>
                      }
                    </div>
                    
                    <ui-input
                      label="Posta Kodu"
                      placeholder="01234"
                      [required]="true"
                      [error]="getFieldError('postalCode')"
                      formControlName="postalCode"
                    />
                  </div>

                  <!-- Phone -->
                  <ui-input
                    label="Telefon"
                    placeholder="05XX XXX XX XX"
                    type="tel"
                    [required]="true"
                    [error]="getFieldError('phone')"
                    formControlName="phone"
                  />
                </ui-card-body>
              </ui-card>
            </div>

            <!-- Order Summary -->
            <div>
              <ui-card class="sticky top-4">
                <ui-card-header>
                  <ui-card-title>Sipariş Özeti</ui-card-title>
                </ui-card-header>
                
                <ui-card-body class="space-y-4">
                  <!-- Items -->
                  <div class="space-y-3 max-h-64 overflow-y-auto">
                    @for (item of cart()!.items; track item.id) {
                      <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                          <img 
                            [src]="item.product.imageUrl" 
                            [alt]="item.product.name"
                            class="w-full h-full object-cover"
                            (error)="onImageError($event)"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1">
                            {{ item.product.name }}
                          </h4>
                          <p class="text-xs text-slate-500 dark:text-slate-400">
                            {{ item.quantity }} adet × {{ item.unitPrice | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
                          </p>
                        </div>
                        <div class="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {{ item.totalPrice | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
                        </div>
                      </div>
                    }
                  </div>

                  <!-- Totals -->
                  <div class="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
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
                    
                    <div class="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span class="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Toplam
                      </span>
                      <span class="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {{ cart()!.totalAmount | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
                      </span>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <ui-button 
                    type="submit"
                    variant="primary" 
                    size="lg"
                    class="w-full"
                    [isDisabled]="!checkoutForm.valid || isSubmitting"
                  >
                    @if (isSubmitting) {
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sipariş Veriliyor...
                    } @else {
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Siparişi Onayla
                    }
                  </ui-button>

                  <!-- Security Info -->
                  <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Güvenli ödeme garantisi</span>
                    </div>
                  </div>
                </ui-card-body>
              </ui-card>
            </div>
          </div>
        </form>
      } @else {
        <!-- Empty Cart -->
        <div class="text-center py-16">
          <svg class="w-24 h-24 text-slate-300 dark:text-slate-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h14M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4"></path>
          </svg>
          
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            Sepetiniz boş
          </h2>
          
          <p class="text-slate-600 dark:text-slate-400 mb-8">
            Sipariş verebilmek için önce sepetinize ürün eklemelisiniz.
          </p>
          
          <ui-button routerLink="/" variant="primary">
            Alışverişe Başla
          </ui-button>
        </div>
      }
    </div>
  `,
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private toastService = inject(UiToastService);

  cart = signal<Cart | null>(null);
  isLoading = signal(true);
  isSubmitting = false;
  cities = TURKISH_CITIES;

  checkoutForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    addressLine1: ['', [Validators.required, Validators.minLength(5)]],
    addressLine2: [''],
    city: ['', [Validators.required]],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^0[5][0-9]{9}$/)]]
  });

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

  onSubmit() {
    if (!this.checkoutForm.valid || this.isSubmitting) {
      this.markFormGroupTouched();
      return;
    }

    const cart = this.cart();
    if (!cart || cart.items.length === 0) {
      this.toastService.error('Sepetinizde ürün bulunmuyor');
      return;
    }

    this.isSubmitting = true;

    const shippingAddress: ShippingAddress = {
      firstName: this.checkoutForm.get('firstName')?.value,
      lastName: this.checkoutForm.get('lastName')?.value,
      addressLine1: this.checkoutForm.get('addressLine1')?.value,
      addressLine2: this.checkoutForm.get('addressLine2')?.value || undefined,
      city: this.checkoutForm.get('city')?.value,
      postalCode: this.checkoutForm.get('postalCode')?.value,
      phone: this.checkoutForm.get('phone')?.value,
    };

    const request: CreateOrderRequest = { shippingAddress };

    this.orderService.createOrder(request).subscribe({
      next: (response) => {
        if (response.data) {
          this.toastService.success('Siparişiniz başarıyla oluşturuldu!');
          // Clear cart after successful order
          this.cartService.clearCart().subscribe();
          // Redirect to order detail
          this.router.navigate(['/orders', response.data.id]);
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.toastService.error('Sipariş oluşturulurken hata oluştu');
        this.isSubmitting = false;
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return 'Bu alan gereklidir';
      }
      if (field.errors['minlength']) {
        return `En az ${field.errors['minlength'].requiredLength} karakter olmalıdır`;
      }
      if (field.errors['pattern']) {
        if (fieldName === 'postalCode') {
          return 'Geçerli bir posta kodu girin (5 haneli)';
        }
        if (fieldName === 'phone') {
          return 'Geçerli bir telefon numarası girin (05XXXXXXXXX)';
        }
      }
    }
    return '';
  }

  private markFormGroupTouched() {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });
  }

  getTotalItems(): number {
    return this.cart()?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  getSubtotal(): number {
    if (!this.cart()?.totalAmount) return 0;
    return this.cart()!.totalAmount / 1.18;
  }

  getVat(): number {
    return this.getSubtotal() * 0.18;
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxNkgyOFYzMkgyMFYxNloiIGZpbGw9IiM5Q0E0QjQiLz4KPHN2Zz4K';
  }
}
