import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { UiToastContainer } from '../shared/ui';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    HeaderComponent, 
    FooterComponent,
    UiToastContainer
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-background">
      <!-- Header -->
      <app-header />
      
      <!-- Main Content -->
      <main class="flex-1">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <router-outlet />
        </div>
      </main>
      
      <!-- Footer -->
      <app-footer />
      
      <!-- Toast Container -->
      <ui-toast-container />
    </div>
  `,
})
export class AppShellComponent {}
