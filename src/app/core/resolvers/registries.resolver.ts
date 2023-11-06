import { map, Observable } from 'rxjs';
import { Registry, RegistryPrivilege } from '@app/auth/models/privilege';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetAvailableRegistries } from '@app/store/app.actions';
import { AppState } from '@app/store/app.state';

@Injectable({
  providedIn: 'root',
})
export class RegistriesResolver {
  constructor(private store: Store) {}

  resolve(): Observable<Record<Registry, RegistryPrivilege[]>> {
    return this.store
      .dispatch(GetAvailableRegistries)
      .pipe(
        map(() => this.store.selectSnapshot(AppState.getAvailableRegistries)),
      );
  }
}
