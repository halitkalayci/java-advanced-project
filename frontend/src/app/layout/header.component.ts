import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiButton, UiBadge } from '../shared/ui';
import { AuthService } from '../auth.service';
import { CartService } from '../core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UiButton, UiBadge],
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="text-xl font-bold text-slate-900 dark:text-slate-100">
              E-Ticaret
            </a>
          </div>

          <!-- Search Bar (Center) -->
          <div class="flex-1 max-w-lg mx-8">
            <div class="relative">
              <input
                type="text"
                placeholder="Ürün ara..."
                class="w-full h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                [(ngModel)]="searchQuery"
                (keyup.enter)="onSearch()"
              />
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Right Side -->
          <div class="flex items-center gap-4">
            <!-- Dark Mode Toggle -->
            <button
              (click)="toggleDarkMode()"
              class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              @if (isDarkMode()) {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
                </svg>
              } @else {
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              }
            </button>

            <!-- Cart -->
            <a 
              routerLink="/cart" 
              class="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h14M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4"></path>
              </svg>
              @if (cartItemsCount() > 0) {
                <ui-badge 
                  variant="error" 
                  class="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs"
                >
                  {{ cartItemsCount() }}
                </ui-badge>
              }
            </a>

            <!-- User Menu -->
            <div class="relative">
              @if (authService.isAuthenticated()) {
                <div class="flex items-center gap-3">
                  <span class="text-sm text-slate-600 dark:text-slate-400">
                    Hoş geldin, {{ authService.getUserName() }}
                  </span>
                  <div class="relative">
                    <button
                      (click)="toggleUserMenu()"
                      class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                        {{ getUserInitials() }}
                      </div>
                    </button>
                    
                    @if (showUserMenu()) {
                      <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2">
                        <a routerLink="/orders" class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                          Siparişlerim
                        </a>
                        @if (authService.hasRole('ROLE_ADMIN')) {
                          <a routerLink="/admin" class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                            Admin Panel
                          </a>
                        }
                        <button 
                          (click)="logout()"
                          class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          Çıkış Yap
                        </button>
                      </div>
                    }
                  </div>
                </div>
              } @else {
                <ui-button (click)="login()" variant="primary">
                  Giriş Yap
                </ui-button>
              }
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  
  searchQuery = '';
  isDarkMode = signal(false);
  showUserMenu = signal(false);
  
  // Use cart service for reactive cart count
  cartItemsCount = this.cartService.itemsCount;

  ngOnInit() {
    // Check if dark mode is enabled
    this.isDarkMode.set(document.documentElement.classList.contains('dark'));
    
    // Load cart data if authenticated
    if (this.authService.isAuthenticated()) {
      this.cartService.getCart().subscribe();
    }
  }

  toggleDarkMode() {
    const isDark = !this.isDarkMode();
    this.isDarkMode.set(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', isDark.toString());
  }

  toggleUserMenu() {
    this.showUserMenu.update(show => !show);
  }

  getUserInitials(): string {
    const name = this.authService.getUserName();
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // TODO: Implement search
      console.log('Searching for:', this.searchQuery);
    }
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
    this.showUserMenu.set(false);
  }
}
