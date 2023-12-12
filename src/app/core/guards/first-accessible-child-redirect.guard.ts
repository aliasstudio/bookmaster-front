import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map, of, switchMap } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthService } from '@app/auth/services/auth.service';
import { GetAvailableRegistries } from '@app/store/app.actions';
import { hasViewPrivilege } from '@app/core/utils/functions';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AppState } from '@app/store/app.state';
import { Registry, RegistryPrivilege } from '@app/auth/models/privilege';
import { differenceInMinutes } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class FirstAccessibleChildRedirectGuard {
  constructor(
    private router: Router,
    private store: Store,
    private authService: AuthService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Record<Registry, RegistryPrivilege[]>> {
    return this.store.dispatch(new GetAvailableRegistries()).pipe(
      map(() => {
        const registries = this.store.selectSnapshot(
          AppState.getAvailableRegistries,
        );

        const registriesRoutes = [...route.routeConfig.children].filter(
          (route) => hasViewPrivilege(route.data?.registryKey, registries),
        );
        const hasPrivilege = registriesRoutes.find(
          (route) => route.path === state.url.slice(1),
        );

        !hasPrivilege &&
          this.router.navigate([registriesRoutes?.[0].path ?? '/']);

        return registries;
      }),
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    const authService = this.authService;

    return authService.isAuthorized$.pipe(
      switchMap((isAuthorized) => {
        if (
          isAuthorized &&
          differenceInMinutes(new Date(), authService.getTokenDate()) < 30
        ) {
          return this.resolve(route, state);
        } else {
          const token = authService.getToken();

          return token
            ? this.authService
                .logout('Сессия авторизации истекла')
                .pipe(switchMap(() => this.router.navigate(['/auth'])))
            : state.url !== '/auth'
            ? of(this.router.navigate(['/auth']))
            : of(true);
        }
      }),
      map(() => true),
    );
  }
}
