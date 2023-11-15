import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MenuItem } from '@app/shared/models/menu-item';
import { AuthService } from '@app/auth/services/auth.service';
import { Router } from '@angular/router';
import { of, takeUntil, tap } from 'rxjs';
import * as _ from 'lodash';
import { DestroyService } from '@app/core/services/destroy.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [DestroyService],
})
export class MenuComponent implements OnInit, AfterViewInit {
  @ViewChild('menu') menuRef!: ElementRef;
  @ViewChildren('menuItems') menuItems!: QueryList<any>;

  protected items: MenuItem[];
  private hoverWidth = 120;
  private initialWidth = 60;

  constructor(
    protected router: Router,
    protected authService: AuthService,
    private destroy$: DestroyService,
  ) {}

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.authService.isAuthorized$.subscribe(() => {
      this.items = this.getMenuItems();
    });
  }

  ngAfterViewInit() {
    this.setHoverWidth();
    this.menuItems.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setHoverWidth();
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

  private setHoverWidth(): void {
    const maxButtonWidth = _.max(
      _.map(
        document.querySelectorAll('.wrapper__menu ul.menu > li'),
        (el) => el.scrollWidth,
      ),
    );
    const padding = 16;

    this.hoverWidth = this.items.length ? padding * 2 + maxButtonWidth : 120;
  }

  private getMenuItems(): MenuItem[] {
    const isAuthorized = this.authService.isAuthorized$.getValue();

    return !isAuthorized
      ? []
      : [
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
