import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { differenceInMinutes } from 'date-fns';
import {DestroyService} from "@app/core/services/destroy.service";
import {switchMap, takeUntil} from "rxjs";
import {Store} from "@ngxs/store";
import {GetAvailableRegistries} from "@app/store/app.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DestroyService]
})
export class AppComponent implements OnInit {
  title = 'Bookmaster3000';

  private authService = inject(AuthService);
  private destroy$ = inject(DestroyService);
  private store = inject(Store);

  ngOnInit(): void {
    const auth = this.authService;
    const tokenDate = auth.getTokenDate();
    const logoutMessage = 'Сессия авторизации истекла';

    if (tokenDate && differenceInMinutes(new Date(), tokenDate) >= 30) {
      auth.logout(logoutMessage).subscribe();
    }

    auth.isAuthorized$.pipe(switchMap(() => this.store.dispatch(GetAvailableRegistries)), takeUntil(this.destroy$)).subscribe()
  }
}
