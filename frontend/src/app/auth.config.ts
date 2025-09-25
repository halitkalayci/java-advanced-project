import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';

export const authConfig: AuthConfig = {
  issuer: environment.auth.issuer,
  clientId: environment.auth.clientId,
  redirectUri: environment.auth.redirectUri,
  responseType: 'code',
  scope: environment.auth.scope,
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  useSilentRefresh: true,
  silentRefreshRedirectUri: environment.auth.silentRefreshRedirectUri,
  requireHttps: false,
};
