import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UiButton, UiInput } from '../../../shared/ui';
import { Product, ProductRequest } from '../../../core';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiButton, UiInput],
  template: `
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <!-- Product Name -->
      <ui-input
        label="Ürün Adı"
        placeholder="Ürün adını girin"
        [required]="true"
        [error]="getFieldError('name')"
        formControlName="name"
      />

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Açıklama
        </label>
        <textarea 
          formControlName="description"
          placeholder="Ürün açıklamasını girin"
          rows="3"
          class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          [class.border-red-300]="getFieldError('description')"
        ></textarea>
        @if (getFieldError('description')) {
          <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ getFieldError('description') }}</p>
        }
      </div>

      <!-- Price and Stock -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ui-input
          label="Fiyat"
          placeholder="0.00"
          type="number"
          [required]="true"
          [error]="getFieldError('price')"
          formControlName="price"
          helper="TL cinsinden"
        />
        
        <ui-input
          label="Stok Miktarı"
          placeholder="0"
          type="number"
          [required]="true"
          [error]="getFieldError('stock')"
          formControlName="stock"
          helper="Adet"
        />
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Kategori <span class="text-red-500">*</span>
        </label>
        <select 
          formControlName="category"
          class="w-full h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          [class.border-red-300]="getFieldError('category')"
        >
          <option value="">Kategori seçin</option>
          <option value="Electronics">Elektronik</option>
          <option value="Clothing">Giyim</option>
          <option value="Books">Kitap</option>
          <option value="Home">Ev & Yaşam</option>
          <option value="Sports">Spor</option>
          <option value="Beauty">Güzellik</option>
          <option value="Toys">Oyuncak</option>
          <option value="Garden">Bahçe</option>
        </select>
        @if (getFieldError('category')) {
          <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ getFieldError('category') }}</p>
        }
      </div>

      <!-- Image URL -->
      <ui-input
        label="Ürün Görseli URL"
        placeholder="https://example.com/image.jpg"
        [required]="true"
        [error]="getFieldError('imageUrl')"
        formControlName="imageUrl"
        helper="Ürün görselinin URL'ini girin"
      />

      <!-- Image Preview -->
      @if (productForm.get('imageUrl')?.value) {
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Görsel Önizleme
          </label>
          <div class="w-32 h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            <img 
              [src]="productForm.get('imageUrl')?.value" 
              alt="Ürün görseli"
              class="w-full h-full object-cover"
              (error)="onImageError($event)"
            />
          </div>
        </div>
      }

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 pt-4">
        <ui-button 
          type="button"
          variant="ghost"
          (click)="onCancel()"
          [isDisabled]="isSubmitting"
        >
          İptal
        </ui-button>
        <ui-button 
          type="submit"
          variant="primary"
          [isDisabled]="!productForm.valid || isSubmitting"
        >
          @if (isSubmitting) {
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Kaydediliyor...
          } @else {
            {{ product ? 'Güncelle' : 'Kaydet' }}
          }
        </ui-button>
      </div>
    </form>
  `,
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() isSubmitting = false;
  @Output() save = new EventEmitter<ProductRequest>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required]],
    imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
  });

  ngOnInit() {
    if (this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description || '',
        price: this.product.price,
        stock: this.product.stock,
        category: this.product.category || '',
        imageUrl: this.product.imageUrl
      });
    }
  }

  onSubmit() {
    if (!this.productForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.productForm.value;
    const productData: ProductRequest = {
      name: formValue.name,
      description: formValue.description || undefined,
      price: parseFloat(formValue.price),
      stock: parseInt(formValue.stock),
      category: formValue.category,
      imageUrl: formValue.imageUrl
    };

    this.save.emit(productData);
  }

  onCancel() {
    this.cancel.emit();
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return 'Bu alan gereklidir';
      }
      if (field.errors['minlength']) {
        return `En az ${field.errors['minlength'].requiredLength} karakter olmalıdır`;
      }
      if (field.errors['min']) {
        return `Minimum değer ${field.errors['min'].min} olmalıdır`;
      }
      if (field.errors['pattern']) {
        if (fieldName === 'imageUrl') {
          return 'Geçerli bir URL girin (http:// veya https://)';
        }
      }
    }
    return '';
  }

  private markFormGroupTouched() {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MiA0MEg3NlY4OEg1MlY0MFoiIGZpbGw9IiM5Q0E0QjQiLz4KPC9zdmc+Cg==';
  }
}
