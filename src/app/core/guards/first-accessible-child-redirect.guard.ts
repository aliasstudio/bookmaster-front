import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
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
    return this.authService.isAuthorized$.pipe(
      map((isAuthorized) => {
        if (isAuthorized) {
          this.resolve(route, state).subscribe();
          return true;
        } else if (state.url !== '/auth') {
          this.router.navigate(['/auth']);
        }

        return true;
      }),
    );
  }
}
