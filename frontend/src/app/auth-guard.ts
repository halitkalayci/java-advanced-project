import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  if (auth.isLoggedIn) return true;
  sessionStorage.setItem('returnUrl', state.url);
  auth.login(); // değilse Keycloak’a gönder
  return false;
};
