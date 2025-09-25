import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiButton, UiBadge, UiCard, UiCardBody } from '../../../shared/ui';
import { Order, AdminService, OrderStatus, AdminOrderSearchParams } from '../../../core';
import { UiToastService } from '../../../shared/ui/toast.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    UiButton, 
    UiBadge, 
    UiCard, 
    UiCardBody
  ],
  template: `
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Sipariş Yönetimi
        </h1>
        <p class="text-slate-600 dark:text-slate-400 mt-2">
          Tüm siparişleri görüntüleyin ve yönetin
        </p>
      </div>

      <!-- Filters -->
      <ui-card class="mb-6">
        <ui-card-body>
          <div class="flex flex-wrap gap-3">
            <button 
              (click)="filterByStatus('')"
              [class]="getFilterButtonClass('')"
            >
              Tümü ({{ getTotalCount() }})
            </button>
            <button 
              (click)="filterByStatus(OrderStatus.CREATED)"
              [class]="getFilterButtonClass(OrderStatus.CREATED)"
            >
              Oluşturuldu ({{ getStatusCount(OrderStatus.CREATED) }})
            </button>
            <button 
              (click)="filterByStatus(OrderStatus.PAID)"
              [class]="getFilterButtonClass(OrderStatus.PAID)"
            >
              Ödendi ({{ getStatusCount(OrderStatus.PAID) }})
            </button>
            <button 
              (click)="filterByStatus(OrderStatus.SHIPPED)"
              [class]="getFilterButtonClass(OrderStatus.SHIPPED)"
            >
              Kargoya Verildi ({{ getStatusCount(OrderStatus.SHIPPED) }})
            </button>
            <button 
              (click)="filterByStatus(OrderStatus.DELIVERED)"
              [class]="getFilterButtonClass(OrderStatus.DELIVERED)"
            >
              Teslim Edildi ({{ getStatusCount(OrderStatus.DELIVERED) }})
            </button>
          </div>
        </ui-card-body>
      </ui-card>

      @if (isLoading()) {
        <!-- Loading State -->
        <div class="space-y-4">
          @for (item of [1,2,3,4,5]; track item) {
            <div class="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          }
        </div>
      } @else if (orders().length > 0) {
        <!-- Orders List -->
        <div class="space-y-4">
          @for (order of orders(); track order.id) {
            <ui-card class="hover:shadow-md transition-shadow">
              <ui-card-body>
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <!-- Order Info -->
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                      <h3 class="font-semibold text-slate-900 dark:text-slate-100">
                        Sipariş #{{ order.id.slice(-8).toUpperCase() }}
                      </h3>
                      <ui-badge [variant]="getOrderStatusVariant(order.status)">
                        {{ getOrderStatusText(order.status) }}
                      </ui-badge>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div>
                        <span class="font-medium">Tarih:</span>
                        {{ order.createdAt | date:'dd/MM/yyyy HH:mm':'tr' }}
                      </div>
                      <div>
                        <span class="font-medium">Müşteri:</span>
                        {{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}
                      </div>
                      <div>
                        <span class="font-medium">Tutar:</span>
                        {{ order.totalAmount | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
                      </div>
                      <div>
                        <span class="font-medium">Ürün:</span>
                        {{ order.items.length }} adet
                      </div>
                    </div>
                  </div>

                  <!-- Status Update & Actions -->
                  <div class="flex flex-col sm:flex-row gap-3 min-w-0 lg:min-w-fit">
                    <!-- Status Update -->
                    <div class="flex items-center gap-2">
                      <select 
                        [value]="order.status"
                        (change)="updateOrderStatus(order, $event)"
                        [disabled]="updatingOrderId === order.id"
                        class="text-sm border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="CREATED">Oluşturuldu</option>
                        <option value="PAID">Ödendi</option>
                        <option value="SHIPPED">Kargoya Verildi</option>
                        <option value="DELIVERED">Teslim Edildi</option>
                        <option value="CANCELLED">İptal Edildi</option>
                      </select>
                      @if (updatingOrderId === order.id) {
                        <svg class="animate-spin w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      }
                    </div>

                    <!-- View Details -->
                    <ui-button 
                      [routerLink]="['/admin/orders', order.id]"
                      variant="secondary"
                      size="sm"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Detay
                    </ui-button>
                  </div>
                </div>
              </ui-card-body>
            </ui-card>
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="flex justify-center mt-8">
            <nav class="flex items-center space-x-2">
              <ui-button 
                variant="ghost" 
                size="sm"
                (click)="goToPage(currentPage() - 1)"
                [isDisabled]="currentPage() <= 0"
              >
                Önceki
              </ui-button>
              
              @for (page of getVisiblePages(); track page) {
                <ui-button 
                  [variant]="page === currentPage() ? 'primary' : 'ghost'"
                  size="sm"
                  (click)="goToPage(page)"
                >
                  {{ page + 1 }}
                </ui-button>
              }
              
              <ui-button 
                variant="ghost" 
                size="sm"
                (click)="goToPage(currentPage() + 1)"
                [isDisabled]="currentPage() >= totalPages() - 1"
              >
                Sonraki
              </ui-button>
            </nav>
          </div>
        }
      } @else {
        <!-- Empty State -->
        <ui-card>
          <ui-card-body class="text-center py-16">
            <svg class="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              @if (selectedStatus) {
                {{ getOrderStatusText(selectedStatus) }} sipariş bulunamadı
              } @else {
                Henüz sipariş yok
              }
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              @if (selectedStatus) {
                Bu durumda sipariş bulunmuyor. Diğer filtreleri deneyin.
              } @else {
                Henüz hiç sipariş verilmemiş.
              }
            </p>
          </ui-card-body>
        </ui-card>
      }
    </div>
  `,
})
export class AdminOrdersComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastService = inject(UiToastService);

  // Template'te enum kullanabilmek için
  OrderStatus = OrderStatus;

  orders = signal<Order[]>([]);
  isLoading = signal(false);
  currentPage = signal(0);
  totalPages = signal(0);
  selectedStatus: OrderStatus | '' = '';
  updatingOrderId: string | null = null;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    
    const params: AdminOrderSearchParams = {
      page: this.currentPage(),
      size: 10,
      sort: 'createdAt,desc'
    };

    if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }

    this.adminService.getOrders(params).subscribe({
      next: (response) => {
        this.orders.set(response.data);
        this.totalPages.set(response.totalPages);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading.set(false);
      }
    });
  }

  filterByStatus(status: OrderStatus | '') {
    this.selectedStatus = status;
    this.currentPage.set(0);
    this.loadOrders();
  }

  updateOrderStatus(order: Order, event: Event) {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value as OrderStatus;
    
    if (newStatus === order.status) {
      return;
    }

    this.updatingOrderId = order.id;

    this.adminService.updateOrderStatus(order.id, newStatus).subscribe({
      next: () => {
        this.toastService.success('Sipariş durumu güncellendi');
        this.loadOrders();
        this.updatingOrderId = null;
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.toastService.error('Sipariş durumu güncellenirken hata oluştu');
        target.value = order.status; // Revert selection
        this.updatingOrderId = null;
      }
    });
  }

  getFilterButtonClass(status: OrderStatus | ''): string {
    const baseClasses = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors';
    const activeClasses = 'bg-indigo-600 text-white';
    const inactiveClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';
    
    return `${baseClasses} ${this.selectedStatus === status ? activeClasses : inactiveClasses}`;
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

  getTotalCount(): number {
    // This would come from API in real implementation
    return 0;
  }

  getStatusCount(status: OrderStatus): number {
    // This would come from API in real implementation
    return 0;
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
    this.loadOrders();
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const delta = 2;
    
    const range = [];
    for (let i = Math.max(0, current - delta); i <= Math.min(current + delta, total - 1); i++) {
      range.push(i);
    }
    return range;
  }
}
