import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const role = authService.authData()?.role;

  if (role != 'admin') {
    return router.createUrlTree(['/data-explorer/customers']);
  }
  return true;
};
