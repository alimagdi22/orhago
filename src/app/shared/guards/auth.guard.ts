import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const token = (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null);

  if (token) {
    return true;
  } else {
    const router = inject(Router);

    router.navigate(['user-management', 'login']);

    return false;
  }
};
