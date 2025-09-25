import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { adminGuard } from './core/admin-guard';

export const routes: Routes = [
  // Public routes
  { 
    path: '', 
    loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent) 
  },
  { 
    path: 'product/:id', 
    loadComponent: () => import('./features/catalog/product-detail.component').then(m => m.ProductDetailComponent) 
  },
  
  // Protected routes
  { 
    path: 'cart', 
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },
  { 
    path: 'checkout', 
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'orders', 
    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'orders/:id', 
    loadComponent: () => import('./features/orders/order-detail.component').then(m => m.OrderDetailComponent),
    canActivate: [authGuard]
  },
  
  // Admin routes
  { 
    path: 'admin', 
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [adminGuard]
  },
  
  // Legacy routes (keeping for compatibility)
  { 
    path: 'secure', 
    loadComponent: () => import('./secure/secure').then(m => m.Secure), 
    canActivate: [authGuard] 
  },
  
  // Fallback
  { path: '**', redirectTo: '' }
];
