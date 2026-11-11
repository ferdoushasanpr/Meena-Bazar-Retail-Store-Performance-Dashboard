import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const isAuthenticated = authService.isAuth();
  const targetUrl = state.url;

  if (!isAuthenticated) {
    if (targetUrl === '/login') {
      return true;
    } else {
      return router.createUrlTree(['/login']);
    }
  }

  if (targetUrl === '/' || targetUrl === '/login') {
    return router.createUrlTree(['/dashboard']);
  } else {
    return true;
  }
};
