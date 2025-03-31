import { Routes } from '@angular/router';
import { authGuard } from './core/service/guards/auth.guard';
import { authenticateGuard } from './core/service/guards/authenticate.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./business/dashboard/dashboard.component'),
        canActivate: [authGuard],
      },
      {
        path: 'tables',
        loadComponent: () => import('./business/tables/tables.component'),
        canActivate: [authGuard],
        children: [
          {
            path: 'categorias',
            loadComponent: () =>
              import('./business/tables/categorias/categorias.component'),
            canActivate: [authGuard],
          },
          {
            path: 'productos',
            loadComponent: () =>
              import('./business/tables/productos/productos.component'),
            canActivate: [authGuard],
          },
          {
            path: 'usuarios',
            loadComponent: () =>
              import('./business/tables/usuarios/usuarios.component'),
            canActivate: [authGuard],
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./business/authentication/login/login.component'),
    canActivate: [authenticateGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
