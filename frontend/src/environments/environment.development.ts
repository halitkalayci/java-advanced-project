export const environment = {
  production: false,
  mockApi: true, // Mock API aktif
  apiBaseUrl: 'http://localhost:8888/api/v1',
  auth: {
    issuer: 'http://localhost:8003/realms/turkcell-ecommerce-dev',
    clientId: 'angular',
    redirectUri: window.location.origin,        // http://localhost:4200
    scope: 'openid profile email',               // id_token claim'leri
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  }
};
  