import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, CreateOrderRequest, UpdateOrderStatusRequest, OrderStatus, ApiResponse, PagedResponse } from './models';

export interface OrderSearchParams {
  status?: OrderStatus;
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/orders`;

  // User Order Operations
  getOrders(params?: OrderSearchParams): Observable<PagedResponse<Order>> {
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

    return this.http.get<PagedResponse<Order>>(this.apiUrl, { params: httpParams });
  }

  getOrder(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${id}`);
  }

  createOrder(request: CreateOrderRequest): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/checkout`, request);
  }

  // Admin Order Operations
  getAllOrders(params?: OrderSearchParams): Observable<PagedResponse<Order>> {
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

    return this.http.get<PagedResponse<Order>>(`${environment.apiBaseUrl}/admin/orders`, { params: httpParams });
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<ApiResponse<Order>> {
    const request: UpdateOrderStatusRequest = { status };
    return this.http.patch<ApiResponse<Order>>(`${environment.apiBaseUrl}/admin/orders/${id}/status`, request);
  }

  // Helper methods
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
}
