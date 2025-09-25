import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UiInput, UiButton } from '../../shared/ui';
import { Product, CatalogService, ProductSearchParams } from '../../core';
import { ProductGridComponent } from './product-grid.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, UiInput, UiButton, ProductGridComponent],
  template: `
    <div class="space-y-6">
      <!-- Search and Filters -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search Input -->
          <div class="flex-1">
            <ui-input
              [(ngModel)]="searchQuery"
              placeholder="Ürün ara..."
              (keyup.enter)="onSearch()"
            />
          </div>
          
          <!-- Category Filter -->
          <div class="w-full md:w-48">
            <select 
              [(ngModel)]="selectedCategory"
              (change)="onCategoryChange()"
              class="w-full h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tüm Kategoriler</option>
              @for (category of categories(); track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
          </div>
          
          <!-- Search Button -->
          <ui-button (click)="onSearch()" [isDisabled]="isLoading()">
            @if (isLoading()) {
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Aranıyor...
            } @else {
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Ara
            }
          </ui-button>
        </div>
        
        <!-- Active Filters -->
        @if (hasActiveFilters()) {
          <div class="mt-4 flex flex-wrap gap-2">
            @if (searchQuery) {
              <span class="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 text-sm rounded-full">
                "{{ searchQuery }}"
                <button (click)="clearSearch()" class="hover:text-indigo-600 dark:hover:text-indigo-400">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </span>
            }
            @if (selectedCategory) {
              <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm rounded-full">
                {{ selectedCategory }}
                <button (click)="clearCategory()" class="hover:text-green-600 dark:hover:text-green-400">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </span>
            }
            <button 
              (click)="clearAllFilters()"
              class="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Tümünü Temizle
            </button>
          </div>
        }
      </div>

      <!-- Results Info -->
      @if (!isLoading() && products().length > 0) {
        <div class="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
          <span>{{ totalResults() }} ürün gösteriliyor</span>
          <div class="flex items-center gap-2">
            <span>Sıralama:</span>
            <select 
              [(ngModel)]="sortBy"
              (change)="onSortChange()"
              class="border border-slate-300 dark:border-slate-700 rounded px-2 py-1 bg-white dark:bg-slate-900 text-sm"
            >
              <option value="">Varsayılan</option>
              <option value="name,asc">İsim (A-Z)</option>
              <option value="name,desc">İsim (Z-A)</option>
              <option value="price,asc">Fiyat (Düşük-Yüksek)</option>
              <option value="price,desc">Fiyat (Yüksek-Düşük)</option>
            </select>
          </div>
        </div>
      }

      <!-- Product Grid -->
      <app-product-grid 
        [products]="products()" 
        [isLoading]="isLoading()"
      />

      <!-- Pagination -->
      @if (!isLoading() && totalPages() > 1) {
        <div class="flex justify-center">
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
    </div>
  `,
})
export class CatalogComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Reactive state
  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  isLoading = signal(false);
  currentPage = signal(0);
  totalPages = signal(0);
  totalResults = signal(0);

  // Form controls
  searchQuery = '';
  selectedCategory = '';
  sortBy = '';

  // Computed
  hasActiveFilters = computed(() => !!(this.searchQuery || this.selectedCategory));

  ngOnInit() {
    // Load categories
    this.loadCategories();
    
    // Handle query params
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.selectedCategory = params['category'] || '';
      this.sortBy = params['sort'] || '';
      const page = parseInt(params['page'] || '0');
      this.currentPage.set(page);
      
      this.loadProducts();
    });
  }

  loadProducts() {
    this.isLoading.set(true);
    
    const params: ProductSearchParams = {
      page: this.currentPage(),
      size: 12,
    };

    if (this.searchQuery) {
      params.search = this.searchQuery;
    }
    if (this.selectedCategory) {
      params.category = this.selectedCategory;
    }
    if (this.sortBy) {
      params.sort = this.sortBy;
    }

    this.catalogService.getProducts(params).subscribe({
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

  loadCategories() {
    this.catalogService.getCategories().subscribe({
      next: (response) => {
        if (response.data) {
          this.categories.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onSearch() {
    this.updateQuery();
  }

  onCategoryChange() {
    this.updateQuery();
  }

  onSortChange() {
    this.updateQuery();
  }

  clearSearch() {
    this.searchQuery = '';
    this.updateQuery();
  }

  clearCategory() {
    this.selectedCategory = '';
    this.updateQuery();
  }

  clearAllFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortBy = '';
    this.updateQuery();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
    this.updateQuery();
  }

  getVisiblePages(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const delta = 2;
    
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(0, current - delta); i <= Math.min(current + delta, total - 1); i++) {
      range.push(i);
    }

    if (range[0] > 1) {
      rangeWithDots.push(0, -1); // -1 represents dots
    } else if (range[0] === 1) {
      rangeWithDots.push(0);
    }

    rangeWithDots.push(...range);

    if (range[range.length - 1] < total - 2) {
      rangeWithDots.push(-1, total - 1); // -1 represents dots
    } else if (range[range.length - 1] === total - 2) {
      rangeWithDots.push(total - 1);
    }

    return rangeWithDots.filter(page => page >= 0); // Remove dots for now
  }

  private updateQuery() {
    const queryParams: any = {};
    
    if (this.searchQuery) queryParams.search = this.searchQuery;
    if (this.selectedCategory) queryParams.category = this.selectedCategory;
    if (this.sortBy) queryParams.sort = this.sortBy;
    if (this.currentPage() > 0) queryParams.page = this.currentPage();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace'
    });
  }
}
