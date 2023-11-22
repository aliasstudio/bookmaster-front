import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthorized$.pipe(
    map((isAuthorized) => {
      if (state.url === '/auth' && isAuthorized) {
        router.navigate(['/books']);
        return false;
      }

      return true;
    }),
  );
};
