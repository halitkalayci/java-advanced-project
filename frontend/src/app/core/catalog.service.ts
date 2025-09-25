import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ApiResponse, PagedResponse } from './models';

export interface ProductSearchParams {
  search?: string;
  category?: string;
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/products`;

  getProducts(params?: ProductSearchParams): Observable<PagedResponse<Product>> {
    let httpParams = new HttpParams();
    
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params?.category) {
      httpParams = httpParams.set('category', params.category);
    }
    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }
    if (params?.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    return this.http.get<PagedResponse<Product>>(this.apiUrl, { params: httpParams });
  }

  getProduct(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/categories`);
  }

  searchProducts(query: string): Observable<PagedResponse<Product>> {
    return this.getProducts({ search: query });
  }
}
