import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiButton, UiBadge, UiCard, UiCardHeader, UiCardBody, UiCardTitle } from '../../../shared/ui';
import { Order, AdminService, OrderStatus } from '../../../core';
import { UiToastService } from '../../../shared/ui/toast.service';

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule,
    UiButton, 
    UiBadge, 
    UiCard, 
    UiCardHeader, 
    UiCardBody, 
    UiCardTitle
  ],
  template: `
    <div class="max-w-6xl mx-auto">
      @if (isLoading()) {
        <!-- Loading State -->
        <div class="space-y-6">
          <div class="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
            <div class="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          </div>
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

          <!-- Status Update -->
          <ui-card>
            <ui-card-body>
              <div class="flex items-center gap-4">
                <label class="font-medium text-slate-700 dark:text-slate-300">
                  Sipariş Durumu:
                </label>
                <select 
                  [(ngModel)]="selectedStatus"
                  (change)="updateStatus()"
                  [disabled]="isUpdating"
                  class="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CREATED">Oluşturuldu</option>
                  <option value="PAID">Ödendi</option>
                  <option value="SHIPPED">Kargoya Verildi</option>
                  <option value="DELIVERED">Teslim Edildi</option>
                  <option value="CANCELLED">İptal Edildi</option>
                </select>
                @if (isUpdating) {
                  <svg class="animate-spin w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                }
              </div>
            </ui-card-body>
          </ui-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Order Details -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Customer Info -->
            <ui-card>
              <ui-card-header>
                <ui-card-title>Müşteri Bilgileri</ui-card-title>
              </ui-card-header>
              <ui-card-body>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label class="font-medium text-slate-700 dark:text-slate-300">Ad Soyad:</label>
                    <p class="text-slate-900 dark:text-slate-100">
                      {{ order()!.shippingAddress.firstName }} {{ order()!.shippingAddress.lastName }}
                    </p>
                  </div>
                  <div>
                    <label class="font-medium text-slate-700 dark:text-slate-300">Telefon:</label>
                    <p class="text-slate-900 dark:text-slate-100">{{ order()!.shippingAddress.phone }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <label class="font-medium text-slate-700 dark:text-slate-300">Adres:</label>
                    <p class="text-slate-900 dark:text-slate-100">
                      {{ order()!.shippingAddress.addressLine1 }}
                      @if (order()!.shippingAddress.addressLine2) {
                        <br>{{ order()!.shippingAddress.addressLine2 }}
                      }
                      <br>{{ order()!.shippingAddress.city }} {{ order()!.shippingAddress.postalCode }}
                    </p>
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

          <!-- Order Summary -->
          <div class="space-y-6">
            <!-- Summary -->
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

            <!-- Actions -->
            <ui-card>
              <ui-card-header>
                <ui-card-title>İşlemler</ui-card-title>
              </ui-card-header>
              <ui-card-body class="space-y-3">
                <ui-button 
                  variant="secondary"
                  class="w-full"
                  (click)="printOrder()"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                  </svg>
                  Yazdır
                </ui-button>
                
                @if (order()!.status === 'CREATED') {
                  <ui-button 
                    variant="destructive"
                    class="w-full"
                    (click)="cancelOrder()"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Siparişi İptal Et
                  </ui-button>
                }
              </ui-card-body>
            </ui-card>
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
            Aradığınız sipariş bulunamadı.
          </p>
          <ui-button routerLink="/admin/orders">
            Siparişlere Dön
          </ui-button>
        </div>
      }
    </div>
  `,
})
export class AdminOrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdminService);
  private toastService = inject(UiToastService);

  order = signal<Order | null>(null);
  isLoading = signal(true);
  isUpdating = false;
  selectedStatus: OrderStatus = OrderStatus.CREATED;

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId);
    }
  }

  loadOrder(id: string) {
    this.isLoading.set(true);
    
    this.adminService.getOrder(id).subscribe({
      next: (response) => {
        if (response.data) {
          this.order.set(response.data);
          this.selectedStatus = response.data.status;
        } else {
          this.order.set(null);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.order.set(null);
        this.isLoading.set(false);
      }
    });
  }

  updateStatus() {
    const order = this.order();
    if (!order || this.selectedStatus === order.status || this.isUpdating) {
      return;
    }

    this.isUpdating = true;

    this.adminService.updateOrderStatus(order.id, this.selectedStatus).subscribe({
      next: (response) => {
        if (response.data) {
          this.order.set(response.data);
          this.toastService.success('Sipariş durumu güncellendi');
        }
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.toastService.error('Sipariş durumu güncellenirken hata oluştu');
        this.selectedStatus = order.status; // Revert
        this.isUpdating = false;
      }
    });
  }

  cancelOrder() {
    const order = this.order();
    if (!order || order.status !== 'CREATED') {
      return;
    }

    if (!confirm('Bu siparişi iptal etmek istediğinizden emin misiniz?')) {
      return;
    }

    this.selectedStatus = OrderStatus.CANCELLED;
    this.updateStatus();
  }

  printOrder() {
    // TODO: Implement print functionality
    this.toastService.info('Yazdırma özelliği yakında eklenecek');
  }

  getOrderStatusText(status: OrderStatus): string {
    const statusTexts = {
      [OrderStatus.CREATED]: 'Oluşturuldu',
      [OrderStatus.PAID]: 'Ödendi',
      [OrderStatus.SHIPPED]: 'Kargoya Verildi',
      [OrderStatus.DELIVERED]: 'Teslim Edildi',
      [OrderStatus.CANCELLED]: 'İptal Edildi'
    };
    return statusTexts[status] || status;
  }

  getOrderStatusVariant(status: OrderStatus): 'default' | 'success' | 'warning' | 'error' | 'info' {
    const variants = {
      [OrderStatus.CREATED]: 'info' as const,
      [OrderStatus.PAID]: 'warning' as const,
      [OrderStatus.SHIPPED]: 'info' as const,
      [OrderStatus.DELIVERED]: 'success' as const,
      [OrderStatus.CANCELLED]: 'error' as const
    };
    return variants[status] || 'default';
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
    this.router.navigate(['/admin/orders']);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNiAyMEgzOFY0NEgyNlYyMFoiIGZpbGw9IiM5Q0E0QjQiLz4KPHN2Zz4K';
  }
}
