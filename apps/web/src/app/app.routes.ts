import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'discover',
    loadComponent: () =>
      import('./features/discover/discover.component').then((m) => m.DiscoverComponent),
  },
  {
    path: 'sessions/:id',
    loadComponent: () =>
      import('./features/sessions/session-detail.component').then(
        (m) => m.SessionDetailComponent,
      ),
  },
  {
    path: 'my-games',
    loadComponent: () =>
      import('./features/my-games/my-games.component').then((m) => m.MyGamesComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth-callback/auth-callback.component').then(
        (m) => m.AuthCallbackComponent,
      ),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./features/privacy/privacy.component').then((m) => m.PrivacyComponent),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./features/terms/terms.component').then((m) => m.TermsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
