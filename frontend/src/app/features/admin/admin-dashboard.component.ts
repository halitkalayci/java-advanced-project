import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiCard, UiCardHeader, UiCardBody, UiCardTitle, UiButton } from '../../shared/ui';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCard, UiCardHeader, UiCardBody, UiCardTitle, UiButton],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Admin Panel
        </h1>
        <p class="text-slate-600 dark:text-slate-400 mt-2">
          E-ticaret yönetim paneline hoş geldiniz
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ui-card>
          <ui-card-body class="text-center">
            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">-</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Toplam Ürün</p>
          </ui-card-body>
        </ui-card>

        <ui-card>
          <ui-card-body class="text-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">-</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Toplam Sipariş</p>
          </ui-card-body>
        </ui-card>

        <ui-card>
          <ui-card-body class="text-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">-</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Toplam Satış</p>
          </ui-card-body>
        </ui-card>

        <ui-card>
          <ui-card-body class="text-center">
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">-</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Aktif Kullanıcı</p>
          </ui-card-body>
        </ui-card>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Product Management -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Ürün Yönetimi</ui-card-title>
          </ui-card-header>
          <ui-card-body class="space-y-4">
            <p class="text-slate-600 dark:text-slate-400">
              Ürünleri yönetin, yeni ürünler ekleyin ve mevcut ürünleri düzenleyin.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <ui-button 
                routerLink="/admin/products"
                variant="primary"
                class="flex-1"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                </svg>
                Ürünleri Görüntüle
              </ui-button>
              <ui-button 
                routerLink="/admin/products"
                variant="secondary"
                class="flex-1"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Yeni Ürün Ekle
              </ui-button>
            </div>
          </ui-card-body>
        </ui-card>

        <!-- Order Management -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Sipariş Yönetimi</ui-card-title>
          </ui-card-header>
          <ui-card-body class="space-y-4">
            <p class="text-slate-600 dark:text-slate-400">
              Siparişleri takip edin, durumlarını güncelleyin ve müşteri işlemlerini yönetin.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <ui-button 
                routerLink="/admin/orders"
                variant="primary"
                class="flex-1"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Siparişleri Görüntüle
              </ui-button>
              <ui-button 
                routerLink="/admin/orders?status=CREATED"
                variant="secondary"
                class="flex-1"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Bekleyen Siparişler
              </ui-button>
            </div>
          </ui-card-body>
        </ui-card>
      </div>

      <!-- Recent Activity -->
      <div class="mt-8">
        <ui-card>
          <ui-card-header>
            <ui-card-title>Son Aktiviteler</ui-card-title>
          </ui-card-header>
          <ui-card-body>
            <div class="text-center py-8">
              <svg class="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <p class="text-slate-500 dark:text-slate-400">
                Henüz aktivite bulunmuyor
              </p>
            </div>
          </ui-card-body>
        </ui-card>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent {}
