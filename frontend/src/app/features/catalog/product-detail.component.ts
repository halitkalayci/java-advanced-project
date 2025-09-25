import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiButton, UiBadge, UiCard, UiCardBody } from '../../shared/ui';
import { Product, CatalogService, CartService } from '../../core';
import { UiToastService } from '../../shared/ui/toast.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, UiButton, UiBadge, UiCard, UiCardBody],
  template: `
    <div class="max-w-6xl mx-auto">
      @if (isLoading()) {
        <!-- Loading Skeleton -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="aspect-square bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse"></div>
          <div class="space-y-4">
            <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 animate-pulse"></div>
            <div class="space-y-2">
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      } @else if (product()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Product Image -->
          <div class="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img 
              [src]="product()!.imageUrl" 
              [alt]="product()!.name"
              class="w-full h-full object-cover"
              (error)="onImageError($event)"
            />
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Basic Info -->
            <div>
              <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {{ product()!.name }}
              </h1>
              <div class="mt-3 flex items-center gap-3">
                <span class="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {{ product()!.price | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
                </span>
                @if (product()!.category) {
                  <ui-badge variant="default">{{ product()!.category }}</ui-badge>
                }
              </div>
              
              <!-- Stock Status -->
              <div class="mt-2">
                @if (product()!.stock <= 0) {
                  <ui-badge variant="error">Stokta Yok</ui-badge>
                } @else if (product()!.stock <= 10) {
                  <ui-badge variant="warning">Son {{ product()!.stock }} adet</ui-badge>
                } @else {
                  <ui-badge variant="success">Stokta Var</ui-badge>
                }
              </div>
            </div>

            <!-- Description -->
            @if (product()!.description) {
              <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  Ürün Açıklaması
                </h2>
                <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {{ product()!.description }}
                </p>
              </div>
            }

            <!-- Add to Cart Section -->
            <ui-card>
              <ui-card-body>
                <div class="space-y-4">
                  <!-- Quantity Selector -->
                  <div class="flex items-center gap-4">
                    <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Adet:
                    </label>
                    <div class="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl">
                      <button 
                        (click)="decreaseQuantity()"
                        [disabled]="quantity <= 1"
                        class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-xl"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <input 
                        [(ngModel)]="quantity"
                        type="number"
                        min="1"
                        [max]="product()!.stock"
                        class="w-16 text-center border-0 bg-transparent focus:outline-none"
                        (change)="validateQuantity()"
                      />
                      <button 
                        (click)="increaseQuantity()"
                        [disabled]="quantity >= product()!.stock"
                        class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-xl"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Total Price -->
                  <div class="flex justify-between items-center text-lg">
                    <span class="font-medium text-slate-700 dark:text-slate-300">Toplam:</span>
                    <span class="font-bold text-slate-900 dark:text-slate-100">
                      {{ getTotalPrice() | currency:'TRY':'symbol-narrow':'1.2-2':'tr' }}
                    </span>
                  </div>

                  <!-- Add to Cart Button -->
                  <ui-button 
                    (click)="addToCart()"
                    [isDisabled]="product()!.stock <= 0 || isAddingToCart"
                    variant="primary"
                    size="lg"
                    class="w-full"
                  >
                    @if (isAddingToCart) {
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sepete Ekleniyor...
                    } @else {
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h14M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4"></path>
                      </svg>
                      @if (product()!.stock <= 0) {
                        Stokta Yok
                      } @else {
                        Sepete Ekle
                      }
                    }
                  </ui-button>
                </div>
              </ui-card-body>
            </ui-card>

            <!-- Quick Actions -->
            <div class="flex gap-3">
              <ui-button 
                variant="ghost" 
                (click)="goBack()"
                class="flex-1"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Geri Dön
              </ui-button>
              <ui-button 
                variant="secondary" 
                (click)="viewCart()"
                class="flex-1"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h14M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4"></path>
                </svg>
                Sepeti Görüntüle
              </ui-button>
            </div>
          </div>
        </div>
      } @else {
        <!-- Product Not Found -->
        <div class="text-center py-12">
          <svg class="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
          </svg>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Ürün Bulunamadı
          </h2>
          <p class="text-slate-600 dark:text-slate-400 mb-6">
            Aradığınız ürün bulunamadı veya artık mevcut değil.
          </p>
          <ui-button (click)="goBack()">
            Ana Sayfaya Dön
          </ui-button>
        </div>
      }
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogService = inject(CatalogService);
  private cartService = inject(CartService);
  private toastService = inject(UiToastService);

  product = signal<Product | null>(null);
  isLoading = signal(true);
  isAddingToCart = false;
  quantity = 1;

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  loadProduct(id: string) {
    this.isLoading.set(true);
    
    this.catalogService.getProduct(id).subscribe({
      next: (response) => {
        if (response.data) {
          this.product.set(response.data);
        } else {
          this.product.set(null);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.product.set(null);
        this.isLoading.set(false);
      }
    });
  }

  increaseQuantity() {
    const product = this.product();
    if (product && this.quantity < product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  validateQuantity() {
    const product = this.product();
    if (!product) return;
    
    if (this.quantity < 1) {
      this.quantity = 1;
    } else if (this.quantity > product.stock) {
      this.quantity = product.stock;
    }
  }

  getTotalPrice(): number {
    const product = this.product();
    return product ? product.price * this.quantity : 0;
  }

  addToCart() {
    const product = this.product();
    if (!product || product.stock <= 0 || this.isAddingToCart) {
      return;
    }

    this.isAddingToCart = true;
    
    this.cartService.addItem(product.id, this.quantity).subscribe({
      next: () => {
        this.toastService.success(`${product.name} sepete eklendi (${this.quantity} adet)`);
        this.isAddingToCart = false;
        // Reset quantity after successful add
        this.quantity = 1;
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.toastService.error('Ürün sepete eklenirken hata oluştu');
        this.isAddingToCart = false;
      }
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTIwSDI0MFYyODBIMTYwVjEyMFoiIGZpbGw9IiM5Q0E0QjQiLz4KPHN2Zz4K';
  }

  goBack() {
    this.router.navigate(['/']);
  }

  viewCart() {
    this.router.navigate(['/cart']);
  }
}
