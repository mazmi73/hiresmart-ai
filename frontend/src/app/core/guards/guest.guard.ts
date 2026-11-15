import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const role = authService.getUserRole();
    if (role === 'ADMIN') {
      router.navigate(['/admin/dashboard']);
    } else if (role === 'RECRUITER') {
      router.navigate(['/recruiter/dashboard']);
    } else {
      router.navigate(['/candidate/dashboard']);
    }
    return false;
  }

  return true;
};
