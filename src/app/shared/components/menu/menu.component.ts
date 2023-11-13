import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from '@app/shared/models/menu-item';
import { AuthService } from '@app/auth/services/auth.service';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements AfterViewInit {
  @ViewChild('menu')
  menuRef!: ElementRef;
  // TODO: временное решение, пока не все ясно с отображаемыми пунктами
  protected items = this.getMenuItems();
  // FIXME: если не будет лень, придумать как отловить момент после рендера меню при смене состава пунктов
  //  и вынести расчет ширины в отдельную функцию, после рендера - вызывать
  private hoverWidth = 180;
  private initialWidth = 60;

  constructor(
    protected router: Router,
    protected authService: AuthService,
  ) {}

  ngAfterViewInit() {
    const maxButtonWidth = _.max(
      _.map(
        document.querySelectorAll('.wrapper__menu ul.menu > li'),
        (el) => el.scrollWidth,
      ),
    );
    const padding = 16;

    this.hoverWidth = padding * 2 + maxButtonWidth;

    this.authService.isAuthorized$.subscribe((isAuthorized) => {
      this.items = isAuthorized ? this.getMenuItems() : [];
    });
  }

  protected onMouseEnter() {
    this.menuRef.nativeElement.style.width = this.hoverWidth + 'px';
  }

  protected onMouseLeave() {
    this.menuRef.nativeElement.style.width = this.initialWidth + 'px';
  }

  protected auth(): void {
    const authService = this.authService;
    const req$ = authService.isAuthorized$.value
      ? authService.logout()
      : of(void 0).pipe(tap(() => this.router.navigate(['/auth'])));

    req$.subscribe();
  }

  private getMenuItems(): MenuItem[] {
    return [
      {
        id: 'users',
        name: 'Пользователи',
        icon: 'icon-user',
        link: 'users',
      },
      {
        id: 'books',
        name: 'Книги',
        icon: 'icon-book',
        link: 'books',
      },
      {
        id: 'authors',
        name: 'Авторы',
        icon: 'icon-author',
        link: 'authors',
      },
      {
        id: 'customers',
        name: 'Клиенты',
        icon: 'icon-customer',
        link: 'customers',
      },
    ];
  }
}
