import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiButton, UiBadge, UiCard, UiCardBody } from '../../shared/ui';
import { Order, OrderService, OrderStatus, OrderSearchParams } from '../../core';

@Component({
  selector: 'app-orders',
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
    <div class="max-w-4xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Siparişlerim
        </h1>
        <p class="text-slate-600 dark:text-slate-400 mt-2">
          Geçmiş siparişlerinizi görüntüleyin ve takip edin
        </p>
      </div>

      <!-- Filters -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-3">
          <button 
            (click)="filterByStatus('')"
            [class]="getFilterButtonClass('')"
          >
            Tümü
          </button>
          <button 
            (click)="filterByStatus(OrderStatus.CREATED)"
            [class]="getFilterButtonClass(OrderStatus.CREATED)"
          >
            Oluşturuldu
          </button>
          <button 
            (click)="filterByStatus(OrderStatus.PAID)"
            [class]="getFilterButtonClass(OrderStatus.PAID)"
          >
            Ödendi
          </button>
          <button 
            (click)="filterByStatus(OrderStatus.SHIPPED)"
            [class]="getFilterButtonClass(OrderStatus.SHIPPED)"
          >
            Kargoya Verildi
          </button>
          <button 
            (click)="filterByStatus(OrderStatus.DELIVERED)"
            [class]="getFilterButtonClass(OrderStatus.DELIVERED)"
          >
            Teslim Edildi
          </button>
        </div>
      </div>

      @if (isLoading()) {
        <!-- Loading State -->
        <div class="space-y-4">
          @for (item of [1,2,3]; track item) {
            <div class="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          }
        </div>
      } @else if (orders().length > 0) {
        <!-- Orders List -->
        <div class="space-y-4">
          @for (order of orders(); track order.id) {
            <ui-card class="hover:shadow-md transition-shadow">
              <ui-card-body>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <!-- Order Info -->
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="font-semibold text-slate-900 dark:text-slate-100">
                        Sipariş #{{ order.id.slice(-8).toUpperCase() }}
                      </h3>
                      <ui-badge [variant]="getOrderStatusVariant(order.status)">
                        {{ getOrderStatusText(order.status) }}
                      </ui-badge>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div>
                        <span class="font-medium">Tarih:</span>
                        {{ order.createdAt | date:'dd/MM/yyyy HH:mm':'tr' }}
                      </div>
                      <div>
                        <span class="font-medium">Toplam:</span>
                        {{ order.totalAmount | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
                      </div>
                      <div class="sm:col-span-2">
                        <span class="font-medium">Ürün Sayısı:</span>
                        {{ order.items.length }} ürün
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-2">
                    <ui-button 
                      [routerLink]="['/orders', order.id]"
                      variant="secondary"
                      size="sm"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Detay
                    </ui-button>
                    
                    @if (order.status === 'DELIVERED') {
                      <ui-button 
                        (click)="reorder(order)"
                        variant="primary"
                        size="sm"
                      >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Tekrar Sipariş Ver
                      </ui-button>
                    }
                  </div>
                </div>

                <!-- Order Items Preview -->
                <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div class="flex gap-3 overflow-x-auto pb-2">
                    @for (item of order.items.slice(0, 4); track item.id) {
                      <div class="flex-shrink-0 flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
                        <div class="w-10 h-10 rounded overflow-hidden bg-slate-200 dark:bg-slate-700">
                          <img 
                            [src]="item.productImageUrl" 
                            [alt]="item.productName"
                            class="w-full h-full object-cover"
                            (error)="onImageError($event)"
                          />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs font-medium text-slate-900 dark:text-slate-100 line-clamp-1">
                            {{ item.productName }}
                          </p>
                          <p class="text-xs text-slate-500 dark:text-slate-400">
                            {{ item.quantity }} adet
                          </p>
                        </div>
                      </div>
                    }
                    @if (order.items.length > 4) {
                      <div class="flex-shrink-0 flex items-center justify-center w-20 h-14 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400">
                        +{{ order.items.length - 4 }} daha
                      </div>
                    }
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
        <div class="text-center py-16">
          <svg class="w-24 h-24 text-slate-300 dark:text-slate-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            @if (selectedStatus) {
                {{ getOrderStatusText(selectedStatus) }} sipariş bulunamadı
            } @else {
              Henüz sipariş vermemişsiniz
            }
          </h2>
          
          <p class="text-slate-600 dark:text-slate-400 mb-8">
            @if (selectedStatus) {
              Bu durumda sipariş bulunmuyor. Diğer filtreleri deneyin.
            } @else {
              İlk siparişinizi vermek için alışverişe başlayın.
            }
          </p>
          
          <ui-button routerLink="/" variant="primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Alışverişe Başla
          </ui-button>
        </div>
      }
    </div>
  `,
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  // Template'te enum kullanabilmek için
  OrderStatus = OrderStatus;

  orders = signal<Order[]>([]);
  isLoading = signal(false);
  currentPage = signal(0);
  totalPages = signal(0);
  selectedStatus: OrderStatus | '' = '';

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    
    const params: OrderSearchParams = {
      page: this.currentPage(),
      size: 10,
      sort: 'createdAt,desc'
    };

    if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }

    this.orderService.getOrders(params).subscribe({
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

  getFilterButtonClass(status: OrderStatus | ''): string {
    const baseClasses = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors';
    const activeClasses = 'bg-indigo-600 text-white';
    const inactiveClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';
    
    return `${baseClasses} ${this.selectedStatus === status ? activeClasses : inactiveClasses}`;
  }

  getOrderStatusText(status: OrderStatus): string {
    return this.orderService.getOrderStatusText(status);
  }

  getOrderStatusVariant(status: OrderStatus) {
    return this.orderService.getOrderStatusVariant(status);
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

  reorder(order: Order) {
    // TODO: Implement reorder functionality
    console.log('Reordering:', order);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxMkgyNFYyOEgxNlYxMloiIGZpbGw9IiM5Q0E0QjQiLz4KPHN2Zz4K';
  }
}
