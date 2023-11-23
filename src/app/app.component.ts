import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { differenceInMinutes } from 'date-fns';
import { DestroyService } from '@app/core/services/destroy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DestroyService],
})
export class AppComponent implements OnInit {
  title = 'Bookmaster3000';

  private authService = inject(AuthService);

  ngOnInit(): void {
    const auth = this.authService;
    const tokenDate = auth.getTokenDate();

    if (tokenDate && differenceInMinutes(new Date(), tokenDate) >= 30) {
      auth.logout('Сессия авторизации истекла').subscribe();
    }
  }
}
