import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UiButton, UiBadge, UiCard, UiCardHeader, UiCardBody, UiCardTitle } from '../../shared/ui';
import { Order, OrderService, OrderStatus } from '../../core';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    UiButton, 
    UiBadge, 
    UiCard, 
    UiCardHeader, 
    UiCardBody, 
    UiCardTitle
  ],
  template: `
    <div class="max-w-4xl mx-auto">
      @if (isLoading()) {
        <!-- Loading State -->
        <div class="space-y-6">
          <div class="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          <div class="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
        </div>
      } @else if (order()) {
        <!-- Page Header -->
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <ui-button 
              variant="ghost" 
              (click)="goBack()"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Geri Dön
            </ui-button>
            <div class="flex-1">
              <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Sipariş #{{ order()!.id.slice(-8).toUpperCase() }}
              </h1>
              <div class="flex items-center gap-3 mt-2">
                <ui-badge [variant]="getOrderStatusVariant(order()!.status)">
                  {{ getOrderStatusText(order()!.status) }}
                </ui-badge>
                <span class="text-slate-600 dark:text-slate-400 text-sm">
                  {{ order()!.createdAt | date:'dd MMMM yyyy HH:mm':'tr' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Order Items -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Order Status Timeline -->
            <ui-card>
              <ui-card-header>
                <ui-card-title>Sipariş Durumu</ui-card-title>
              </ui-card-header>
              <ui-card-body>
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <div [class]="getStatusIndicatorClass(OrderStatus.CREATED)">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-slate-900 dark:text-slate-100">Sipariş Oluşturuldu</p>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        {{ order()!.createdAt | date:'dd/MM/yyyy HH:mm':'tr' }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-4">
                    <div [class]="getStatusIndicatorClass(OrderStatus.PAID)">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-slate-900 dark:text-slate-100">Ödeme Alındı</p>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        @if (isStatusCompleted(OrderStatus.PAID)) {
                          Ödeme başarıyla alındı
                        } @else {
                          Ödeme bekleniyor
                        }
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-4">
                    <div [class]="getStatusIndicatorClass(OrderStatus.SHIPPED)">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-slate-900 dark:text-slate-100">Kargoya Verildi</p>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        @if (isStatusCompleted(OrderStatus.SHIPPED)) {
                          Ürünleriniz yola çıktı
                        } @else {
                          Kargo hazırlığı yapılıyor
                        }
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-4">
                    <div [class]="getStatusIndicatorClass(OrderStatus.DELIVERED)">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 2a1 1 0 00-2 0v2a1 1 0 102 0v-2z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-slate-900 dark:text-slate-100">Teslim Edildi</p>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        @if (isStatusCompleted(OrderStatus.DELIVERED)) {
                          Siparişiniz teslim edildi
                        } @else {
                          Teslimat bekleniyor
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </ui-card-body>
            </ui-card>

            <!-- Order Items -->
            <ui-card>
              <ui-card-header>
                <ui-card-title>Sipariş İçeriği</ui-card-title>
              </ui-card-header>
              <ui-card-body>
                <div class="space-y-4">
                  @for (item of order()!.items; track item.id) {
                    <div class="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div class="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                        <img 
                          [src]="item.productImageUrl" 
                          [alt]="item.productName"
                          class="w-full h-full object-cover"
                          (error)="onImageError($event)"
                        />
                      </div>
                      
                      <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                          {{ item.productName }}
                        </h4>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {{ item.quantity }} adet × {{ item.unitPrice | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
                        </p>
                      </div>
                      
                      <div class="text-right">
                        <p class="font-semibold text-slate-900 dark:text-slate-100">
                          {{ item.totalPrice | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
                        </p>
                      </div>
                    </div>
                  }
                </div>
              </ui-card-body>
            </ui-card>
          </div>

          <!-- Order Summary & Shipping -->
          <div class="space-y-6">
            <!-- Order Summary -->
            <ui-card>
              <ui-card-header>
                <ui-card-title>Sipariş Özeti</ui-card-title>
              </ui-card-header>
              <ui-card-body class="space-y-3">
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
                  <span class="text-green-600 dark:text-green-400">Ücretsiz</span>
                </div>
                
                <hr class="border-slate-200 dark:border-slate-700">
                
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-slate-900 dark:text-slate-100">Toplam</span>
                  <span class="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {{ order()!.totalAmount | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
                  </span>
                </div>
              </ui-card-body>
            </ui-card>

            <!-- Shipping Address -->
            <ui-card>
              <ui-card-header>
                <ui-card-title>Teslimat Adresi</ui-card-title>
              </ui-card-header>
              <ui-card-body>
                <div class="text-sm space-y-2">
                  <p class="font-medium text-slate-900 dark:text-slate-100">
                    {{ order()!.shippingAddress.firstName }} {{ order()!.shippingAddress.lastName }}
                  </p>
                  <p class="text-slate-600 dark:text-slate-400">
                    {{ order()!.shippingAddress.addressLine1 }}
                  </p>
                  @if (order()!.shippingAddress.addressLine2) {
                    <p class="text-slate-600 dark:text-slate-400">
                      {{ order()!.shippingAddress.addressLine2 }}
                    </p>
                  }
                  <p class="text-slate-600 dark:text-slate-400">
                    {{ order()!.shippingAddress.city }} {{ order()!.shippingAddress.postalCode }}
                  </p>
                  <p class="text-slate-600 dark:text-slate-400">
                    {{ order()!.shippingAddress.phone }}
                  </p>
                </div>
              </ui-card-body>
            </ui-card>

            <!-- Actions -->
            @if (order()!.status === 'DELIVERED') {
              <ui-button 
                (click)="reorder()"
                variant="primary"
                class="w-full"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Tekrar Sipariş Ver
              </ui-button>
            }
          </div>
        </div>
      } @else {
        <!-- Order Not Found -->
        <div class="text-center py-16">
          <svg class="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Sipariş Bulunamadı
          </h2>
          <p class="text-slate-600 dark:text-slate-400 mb-6">
            Aradığınız sipariş bulunamadı veya erişim izniniz yok.
          </p>
          <ui-button routerLink="/orders">
            Siparişlerime Dön
          </ui-button>
        </div>
      }
    </div>
  `,
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  // Template'te enum kullanabilmek için
  OrderStatus = OrderStatus;

  order = signal<Order | null>(null);
  isLoading = signal(true);

  private statusOrder: OrderStatus[] = [OrderStatus.CREATED, OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED];

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId);
    }
  }

  loadOrder(id: string) {
    this.isLoading.set(true);
    
    this.orderService.getOrder(id).subscribe({
      next: (response) => {
        this.order.set(response.data || null);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.order.set(null);
        this.isLoading.set(false);
      }
    });
  }

  getOrderStatusText(status: OrderStatus): string {
    return this.orderService.getOrderStatusText(status);
  }

  getOrderStatusVariant(status: OrderStatus) {
    return this.orderService.getOrderStatusVariant(status);
  }

  isStatusCompleted(status: OrderStatus): boolean {
    const order = this.order();
    if (!order) return false;
    
    const currentIndex = this.statusOrder.indexOf(order.status);
    const checkIndex = this.statusOrder.indexOf(status);
    
    return currentIndex >= checkIndex;
  }

  getStatusIndicatorClass(status: OrderStatus): string {
    const isCompleted = this.isStatusCompleted(status);
    const isCurrent = this.order()?.status === status;
    
    const baseClasses = 'w-10 h-10 rounded-full flex items-center justify-center';
    
    if (isCompleted) {
      return `${baseClasses} bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400`;
    } else if (isCurrent) {
      return `${baseClasses} bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400`;
    } else {
      return `${baseClasses} bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600`;
    }
  }

  getTotalItems(): number {
    return this.order()?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  getSubtotal(): number {
    const order = this.order();
    if (!order?.totalAmount) return 0;
    return order.totalAmount / 1.18;
  }

  getVat(): number {
    return this.getSubtotal() * 0.18;
  }

  goBack() {
    this.router.navigate(['/orders']);
  }

  reorder() {
    // TODO: Implement reorder functionality
    console.log('Reordering:', this.order());
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNiAyMEgzOFY0NEgyNlYyMFoiIGZpbGw9IiM5Q0E0QjQiLz4KPHN2Zz4K';
  }
}
