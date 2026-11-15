import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const recruiterGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isRecruiter()) {
    return true;
  }

  if (authService.isAuthenticated() && authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  if (authService.isAuthenticated() && authService.isCandidate()) {
    router.navigate(['/candidate/dashboard']);
    return false;
  }

  router.navigate(['/auth/login']);
  return false;
};
