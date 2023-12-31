import {
  AfterViewInit,
  ChangeDetectorRef,
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
import { map, of, takeUntil, tap } from 'rxjs';
import * as _ from 'lodash';
import { DestroyService } from '@app/core/services/destroy.service';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { AppState } from '@app/store/app.state';
import { Registry, RegistryPrivilege } from '@app/auth/models/privilege';
import { GetAvailableRegistries } from '@app/store/app.actions';

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
  private availableRegistries: Record<Registry, RegistryPrivilege[]>;

  constructor(
    protected router: Router,
    protected authService: AuthService,
    private destroy$: DestroyService,
    private store: Store,
    private changeDetector: ChangeDetectorRef,
    private actions$: Actions,
  ) {}

  ngOnInit(): void {
    this.items = this.getMenuItems();

    this.actions$
      .pipe(
        ofActionSuccessful(GetAvailableRegistries),
        map(() => this.store.selectSnapshot(AppState.getAvailableRegistries)),
      )
      .subscribe((registries) => {
        this.availableRegistries = registries;
        this.items = this.getMenuItems();
      });

    this.authService.isAuthorized$.subscribe(() => {
      this.items = this.getMenuItems();
      this.changeDetector.markForCheck();
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

    this.hoverWidth = this.items?.length ? padding * 2 + maxButtonWidth : 120;
  }

  private getMenuItems(): MenuItem[] {
    const isAuthorized = this.authService.isAuthorized$.getValue();
    const menuItems = !isAuthorized
      ? []
      : [
          {
            id: Registry.User,
            name: 'Пользователи',
            icon: 'icon-user',
            link: 'users',
          },
          {
            id: Registry.Book,
            name: 'Книги',
            icon: 'icon-book',
            link: 'books',
          },
          {
            id: Registry.Author,
            name: 'Авторы',
            icon: 'icon-author',
            link: 'authors',
          },
          {
            id: Registry.Customer,
            name: 'Клиенты',
            icon: 'icon-customer',
            link: 'customers',
          },
          {
            id: Registry.BookReturn,
            name: 'Выдача',
            icon: 'icon-arrows',
            link: 'book-return',
            hidden: (registries) =>
              !registries?.[Registry.BookReturn]?.includes(
                RegistryPrivilege.Edit,
              ),
          },
          {
            id: Registry.Reports,
            name: 'Отчеты',
            icon: 'icon-chart',
            link: 'reports',
          },
        ];

    return menuItems.filter((item) => {
      const registries = this.availableRegistries;
      const registriesKeys = _.keys(this.availableRegistries);

      return (
        !!registries &&
        ((!item.hidden?.call(this, registries) &&
          registriesKeys?.includes(item.id)) ||
          registriesKeys?.includes(Registry.All))
      );
    });
  }
}
