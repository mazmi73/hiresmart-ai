import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const candidateGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isCandidate()) {
    return true;
  }

  if (authService.isAuthenticated() && authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  if (authService.isAuthenticated() && authService.isRecruiter()) {
    router.navigate(['/recruiter/dashboard']);
    return false;
  }

  router.navigate(['/auth/login']);
  return false;
};
