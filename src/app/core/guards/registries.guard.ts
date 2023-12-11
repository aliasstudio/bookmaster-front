import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AuthService } from '@app/auth/services/auth.service';
import { GetAvailableRegistries } from '@app/store/app.actions';
import { Registry, RegistryPrivilege } from '@app/auth/models/privilege';
import { hasViewPrivilege } from '@app/core/utils/functions';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RegistriesGuard {
  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private authService: AuthService,
  ) {}

  resolve(): Observable<Record<Registry, RegistryPrivilege[]>> {
    return this.authService.isAuthorized$.getValue()
      ? this.store.dispatch(new GetAvailableRegistries())
      : of(null);
  }

  canActivate(): Observable<boolean> {
    const registryKey = this.route.snapshot.data?.registryKey as Registry;

    return this.resolve().pipe(
      map((registries) => hasViewPrivilege(registryKey, registries)),
      catchError(() => of(false)),
    );
  }
}
