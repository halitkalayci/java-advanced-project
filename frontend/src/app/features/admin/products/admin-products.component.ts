import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiButton, UiInput, UiCard, UiCardHeader, UiCardBody, UiCardTitle, UiModal, UiModalHeader, UiModalBody, UiModalTitle } from '../../../shared/ui';
import { Product, AdminService, ProductRequest, AdminProductSearchParams } from '../../../core';
import { UiToastService } from '../../../shared/ui/toast.service';
import { ProductFormComponent } from './product-form.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    UiButton, 
    UiInput,
    UiCard, 
    UiCardHeader, 
    UiCardBody, 
    UiCardTitle,
    UiModal,
    UiModalHeader,
    UiModalBody,
    UiModalTitle,
    ProductFormComponent
  ],
  template: `
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Ürün Yönetimi
          </h1>
          <p class="text-slate-600 dark:text-slate-400 mt-2">
            Ürünleri yönetin, ekleyin ve düzenleyin
          </p>
        </div>
        <ui-button 
          (click)="openCreateModal()"
          variant="primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Yeni Ürün Ekle
        </ui-button>
      </div>

      <!-- Filters -->
      <ui-card class="mb-6">
        <ui-card-body>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <ui-input
                [(ngModel)]="searchQuery"
                placeholder="Ürün ara..."
                (keyup.enter)="search()"
              />
            </div>
            <div class="w-full md:w-48">
              <select 
                [(ngModel)]="selectedCategory"
                (change)="search()"
                class="w-full h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tüm Kategoriler</option>
                <option value="Electronics">Elektronik</option>
                <option value="Clothing">Giyim</option>
                <option value="Books">Kitap</option>
                <option value="Home">Ev & Yaşam</option>
              </select>
            </div>
            <ui-button (click)="search()" [isDisabled]="isLoading()">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Ara
            </ui-button>
          </div>
        </ui-card-body>
      </ui-card>

      @if (isLoading()) {
        <!-- Loading State -->
        <div class="space-y-4">
          @for (item of [1,2,3,4,5]; track item) {
            <div class="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          }
        </div>
      } @else if (products().length > 0) {
        <!-- Products Table -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Ürünler ({{ totalResults() }})</ui-card-title>
          </ui-card-header>
          <ui-card-body class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left py-3 px-2 font-medium text-slate-900 dark:text-slate-100">Ürün</th>
                  <th class="text-left py-3 px-2 font-medium text-slate-900 dark:text-slate-100">Kategori</th>
                  <th class="text-right py-3 px-2 font-medium text-slate-900 dark:text-slate-100">Fiyat</th>
                  <th class="text-right py-3 px-2 font-medium text-slate-900 dark:text-slate-100">Stok</th>
                  <th class="text-right py-3 px-2 font-medium text-slate-900 dark:text-slate-100">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                @for (product of products(); track product.id) {
                  <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="py-3 px-2">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                          <img 
                            [src]="product.imageUrl" 
                            [alt]="product.name"
                            class="w-full h-full object-cover"
                            (error)="onImageError($event)"
                          />
                        </div>
                        <div class="min-w-0">
                          <h4 class="font-medium text-slate-900 dark:text-slate-100 line-clamp-1">
                            {{ product.name }}
                          </h4>
                          @if (product.description) {
                            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                              {{ product.description }}
                            </p>
                          }
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-2">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                        {{ product.category || 'Belirsiz' }}
                      </span>
                    </td>
                    <td class="py-3 px-2 text-right font-medium text-slate-900 dark:text-slate-100">
                      {{ product.price | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
                    </td>
                    <td class="py-3 px-2 text-right">
                      <span [class]="getStockBadgeClass(product.stock)">
                        {{ product.stock }}
                      </span>
                    </td>
                    <td class="py-3 px-2">
                      <div class="flex justify-end gap-2">
                        <ui-button 
                          (click)="openEditModal(product)"
                          variant="ghost"
                          size="sm"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </ui-button>
                        <ui-button 
                          (click)="deleteProduct(product)"
                          variant="ghost"
                          size="sm"
                          class="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                          [isDisabled]="isDeletingProduct === product.id"
                        >
                          @if (isDeletingProduct === product.id) {
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
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </ui-card-body>
        </ui-card>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="flex justify-center mt-6">
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
            </svg>
            <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              Ürün bulunamadı
            </h3>
            <p class="text-slate-600 dark:text-slate-400 mb-6">
              Henüz ürün eklenmemiş veya arama kriterlerinize uygun ürün yok.
            </p>
            <ui-button (click)="openCreateModal()" variant="primary">
              İlk Ürünü Ekle
            </ui-button>
          </ui-card-body>
        </ui-card>
      }

      <!-- Product Form Modal -->
      <ui-modal [isOpen]="showModal()" (close)="closeModal()">
        <ui-modal-header (close)="closeModal()">
          <ui-modal-title>
            {{ isEditing() ? 'Ürün Düzenle' : 'Yeni Ürün Ekle' }}
          </ui-modal-title>
        </ui-modal-header>
        
        <ui-modal-body>
          <app-product-form
            [product]="editingProduct()"
            [isSubmitting]="isSubmitting"
            (save)="onProductSave($event)"
            (cancel)="closeModal()"
          />
        </ui-modal-body>
      </ui-modal>
    </div>
  `,
})
export class AdminProductsComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastService = inject(UiToastService);

  products = signal<Product[]>([]);
  isLoading = signal(false);
  currentPage = signal(0);
  totalPages = signal(0);
  totalResults = signal(0);
  
  showModal = signal(false);
  isEditing = signal(false);
  editingProduct = signal<Product | null>(null);
  isSubmitting = false;
  isDeletingProduct: string | null = null;

  searchQuery = '';
  selectedCategory = '';

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    
    const params: AdminProductSearchParams = {
      page: this.currentPage(),
      size: 10,
      sort: 'createdAt,desc'
    };

    if (this.searchQuery) {
      params.search = this.searchQuery;
    }
    if (this.selectedCategory) {
      params.category = this.selectedCategory;
    }

    this.adminService.getProducts(params).subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.totalPages.set(response.totalPages);
        this.totalResults.set(response.total);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      }
    });
  }

  search() {
    this.currentPage.set(0);
    this.loadProducts();
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.editingProduct.set(null);
    this.showModal.set(true);
  }

  openEditModal(product: Product) {
    this.isEditing.set(true);
    this.editingProduct.set(product);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.isEditing.set(false);
    this.editingProduct.set(null);
    this.isSubmitting = false;
  }

  onProductSave(productData: ProductRequest) {
    this.isSubmitting = true;

    const operation = this.isEditing() 
      ? this.adminService.updateProduct(this.editingProduct()!.id, productData)
      : this.adminService.createProduct(productData);

    operation.subscribe({
      next: () => {
        this.toastService.success(
          this.isEditing() ? 'Ürün başarıyla güncellendi' : 'Ürün başarıyla eklendi'
        );
        this.closeModal();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error saving product:', error);
        this.toastService.error('Ürün kaydedilirken hata oluştu');
        this.isSubmitting = false;
      }
    });
  }

  deleteProduct(product: Product) {
    if (!confirm(`"${product.name}" ürününü silmek istediğinizden emin misiniz?`)) {
      return;
    }

    this.isDeletingProduct = product.id;

    this.adminService.deleteProduct(product.id).subscribe({
      next: () => {
        this.toastService.success('Ürün başarıyla silindi');
        this.loadProducts();
        this.isDeletingProduct = null;
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.toastService.error('Ürün silinirken hata oluştu');
        this.isDeletingProduct = null;
      }
    });
  }

  getStockBadgeClass(stock: number): string {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    if (stock <= 0) {
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
    } else if (stock <= 10) {
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`;
    } else {
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
    }
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
    this.loadProducts();
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

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxNkgyOFYzMkgyMFYxNloiIGZpbGw9IiM5Q0E0QjQiLz4KPHN2Zz4K';
  }
}
