import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { differenceInMinutes } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Bookmaster3000';

  private authService = inject(AuthService);

  ngOnInit(): void {
    const tokenDate = this.authService.getTokenDate();
    const logoutMessage = 'Сессия авторизации истекла';

    if (tokenDate && differenceInMinutes(new Date(), tokenDate) >= 30) {
      this.authService.logout(logoutMessage).subscribe();
    }
  }
}
