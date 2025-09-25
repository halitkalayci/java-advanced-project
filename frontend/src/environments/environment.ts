export const environment = {
  production: true,
  mockApi: false, // Production'da mock kapalı
  apiBaseUrl: 'https://api.example.com/api/v1',
  auth: {
    issuer: 'https://keycloak.example.com/realms/ecom',
    clientId: 'ecom-web',
    redirectUri: 'https://web.example.com',
    scope: 'openid profile email',
    silentRefreshRedirectUri: 'https://web.example.com/silent-refresh.html',
  }
};
