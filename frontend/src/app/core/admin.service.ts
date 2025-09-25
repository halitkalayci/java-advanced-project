import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductRequest, Order, OrderStatus, UpdateOrderStatusRequest, ApiResponse, PagedResponse } from './models';

export interface AdminProductSearchParams {
  search?: string;
  category?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface AdminOrderSearchParams {
  status?: OrderStatus;
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/admin`;

  // Product Management
  getProducts(params?: AdminProductSearchParams): Observable<PagedResponse<Product>> {
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

    return this.http.get<PagedResponse<Product>>(`${this.baseUrl}/products`, { params: httpParams });
  }

  getProduct(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/products/${id}`);
  }

  createProduct(product: ProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/products`, product);
  }

  updateProduct(id: string, product: ProductRequest): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.baseUrl}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/products/${id}`);
  }

  // Order Management
  getOrders(params?: AdminOrderSearchParams): Observable<PagedResponse<Order>> {
    let httpParams = new HttpParams();
    
    if (params?.status) {
      httpParams = httpParams.set('status', params.status);
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

    return this.http.get<PagedResponse<Order>>(`${this.baseUrl}/orders`, { params: httpParams });
  }

  getOrder(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/orders/${id}`);
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<ApiResponse<Order>> {
    const request: UpdateOrderStatusRequest = { status };
    return this.http.patch<ApiResponse<Order>>(`${this.baseUrl}/orders/${id}/status`, request);
  }
}
