import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { Registry, RegistryPrivilege } from '@app/auth/models/privilege';
import { GetAvailableRegistries } from '@app/store/app.actions';
import { AuthService } from '@app/auth/services/auth.service';
import { tap } from 'rxjs';
import { ValueOrObservable } from '@app/core/models/interfaces';
import { User } from '@app/auth/models/user';

interface AppStateModel {
  availableRegistries: Record<Registry, RegistryPrivilege[]>;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    availableRegistries: null,
  },
})
@Injectable()
export class AppState {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  @Action(GetAvailableRegistries, { cancelUncompleted: true })
  getAvailableRegistries(
    ctx: StateContext<AppStateModel>,
  ): ValueOrObservable<User> {
    // const state = ctx.getState();

    // if (state?.availableRegistries) {
    //   return state.availableRegistries;
    // }

    return this.auth.currentUser().pipe(
      tap((user) => {
        ctx.patchState({ availableRegistries: user.allRegistry });
      }),
    );
  }

  @Selector([AppState])
  static getAvailableRegistries(
    state: AppStateModel,
  ): Record<Registry, RegistryPrivilege[]> {
    return state?.availableRegistries;
  }
}
