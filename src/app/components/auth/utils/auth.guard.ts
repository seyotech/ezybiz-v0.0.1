import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.services';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map(user => {
      const isLoginPage = state.url.includes('/sign-in');

      if (isLoginPage && user) {
        router.navigate(['/']);
        return false;
      }

      if (!isLoginPage && !user) {
        router.navigate(['/sign-in'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
      return true;
    })
  );
};




























// import { inject } from '@angular/core';
// import { CanActivateFn } from '@angular/router';
// import { map } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../services/auth.services';

// export const authGuard: CanActivateFn = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   return authService.isLoggedIn().pipe(
//     map((loggedIn) => {
//       return loggedIn ? true : router.createUrlTree(['/sign-in']);
//     })
//   );
// };
