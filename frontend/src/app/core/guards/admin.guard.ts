import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  if (authService.isAuthenticated()) {
    if (authService.isRecruiter()) {
      router.navigate(['/recruiter/dashboard']);
    } else {
      router.navigate(['/candidate/dashboard']);
    }
    return false;
  }

  router.navigate(['/auth/login']);
  return false;
};
