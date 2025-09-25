import { APP_INITIALIZER, ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { OAuthModuleConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor';
import { authConfig } from './auth.config';
import { environment } from '../environments/environment';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './core/mocks/in-memory-data.service';

function initAuth(oauth: OAuthService, router: Router) {
  return async () => {
    oauth.configure(authConfig);
    await oauth.loadDiscoveryDocumentAndTryLogin();

    // OIDC query paramlarını temizle (code, state, iss, session_state vs.)
    if (location.search) {
      history.replaceState({}, document.title, location.pathname);
    }

    // returnUrl varsa oraya dön
    if (oauth.hasValidAccessToken()) {
      const stateFromOidc = oauth.state; // initLoginFlow'a state verirsen buradan gelir
      const stored = sessionStorage.getItem('returnUrl');
      const target = stored ?? stateFromOidc;
      if (target) {
        sessionStorage.removeItem('returnUrl');
        router.navigateByUrl(decodeURIComponent(target));
      }
    }
  };
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
    provideOAuthClient(authConfig as OAuthModuleConfig),
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initAuth, deps: [OAuthService, Router], multi: true },
    
    // Mock API Provider (sadece development'ta aktif)
    ...(environment.mockApi
      ? [importProvidersFrom(InMemoryWebApiModule.forRoot(InMemoryDataService, {
          apiBase: '/api/v1',
          delay: 600,
          passThruUnknownUrl: true
        }))]
      : [])
  ]
};
