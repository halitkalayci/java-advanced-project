import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest, ApiResponse } from './models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/cart`;

  // Reactive state
  cart = signal<Cart | null>(null);
  itemsCount = signal(0);
  totalAmount = signal(0);

  getCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.apiUrl).pipe(
      tap(response => {
        if (response.data) {
          this.updateCartState(response.data);
        }
      })
    );
  }

  addItem(productId: string, quantity: number): Observable<ApiResponse<CartItem>> {
    const request: AddToCartRequest = { productId, quantity };
    return this.http.post<ApiResponse<CartItem>>(`${this.apiUrl}/items`, request).pipe(
      tap(() => {
        // Refresh cart after adding item
        this.getCart().subscribe();
      })
    );
  }

  updateItem(itemId: string, quantity: number): Observable<ApiResponse<CartItem>> {
    const request: UpdateCartItemRequest = { quantity };
    return this.http.put<ApiResponse<CartItem>>(`${this.apiUrl}/items/${itemId}`, request).pipe(
      tap(() => {
        // Refresh cart after updating item
        this.getCart().subscribe();
      })
    );
  }

  removeItem(itemId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/items/${itemId}`).pipe(
      tap(() => {
        // Refresh cart after removing item
        this.getCart().subscribe();
      })
    );
  }

  clearCart(): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(this.apiUrl).pipe(
      tap(() => {
        this.updateCartState(null);
      })
    );
  }

  private updateCartState(cart: Cart | null) {
    this.cart.set(cart);
    this.itemsCount.set(cart?.items?.length || 0);
    this.totalAmount.set(cart?.totalAmount || 0);
  }

  // Helper methods for reactive access
  getItemsCount() {
    return this.itemsCount();
  }

  getTotalAmount() {
    return this.totalAmount();
  }

  getItems() {
    return this.cart()?.items || [];
  }

  isEmpty() {
    return this.itemsCount() === 0;
  }
}
