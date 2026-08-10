import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const UnAuthGuard: CanActivateFn = (route, state) => {
  const token = (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null);

  if (token) {
    const router = inject(Router);

    router.navigate(['/user-management']);

    return false;
  } else {
    return true;
  }
};
