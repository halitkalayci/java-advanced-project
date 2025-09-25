import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./products/admin-products.component').then(m => m.AdminProductsComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/admin-orders.component').then(m => m.AdminOrdersComponent)
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./orders/admin-order-detail.component').then(m => m.AdminOrderDetailComponent)
  }
];
