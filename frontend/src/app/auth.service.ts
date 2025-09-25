import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private oauth: OAuthService, private router: Router) {}

  login() { 
    const state = encodeURIComponent(this.router.url || '/');
    this.oauth.initLoginFlow(state); 
  }

  logout() { 
    this.oauth.logOut(); // Keycloak end_session da çağrılır
    this.router.navigate(['/']);
  }

  get accessToken(): string | null {
    return this.oauth.getAccessToken() || null;
  }

  isAuthenticated(): boolean {
    return this.oauth.hasValidAccessToken();
  }

  get isLoggedIn(): boolean {
    return this.oauth.hasValidAccessToken();
  }

  get claims(): any {
    return this.oauth.getIdentityClaims();
  }

  getUserName(): string {
    const claims = this.claims;
    return claims?.['name'] || claims?.['preferred_username'] || 'Kullanıcı';
  }

  getUserEmail(): string {
    const claims = this.claims;
    return claims?.['email'] || '';
  }

  hasRole(role: string): boolean {
    const claims = this.claims;
    const realmAccess = claims?.['realm_access'];
    return realmAccess?.['roles']?.includes(role) || false;
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  getUser() {
    const claims = this.claims;
    if (!claims) return null;
    
    return {
      id: claims['sub'],
      name: this.getUserName(),
      email: this.getUserEmail(),
      roles: claims['realm_access']?.['roles'] || []
    };
  }
}
