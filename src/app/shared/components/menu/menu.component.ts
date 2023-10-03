import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { MenuItem } from '@app/shared/models/menu-item';
import { AuthService } from '@app/auth/services/auth.service';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements AfterViewInit {
  @ViewChild('menu')
  menuRef!: ElementRef;
  // TODO: временное решение, пока не все ясно с отображаемыми пунктами
  @Input() items: MenuItem[] = [
    {
      id: 'books',
      name: 'Книги',
      icon: 'icon-book',
    },
    {
      id: 'create',
      name: 'Добавить',
      icon: 'icon-add',
    },
    {
      id: 'reports',
      name: 'Отчеты',
      icon: 'icon-chart',
    },
  ];

  private hoverWidth = 160;
  private initialWidth = 60;

  constructor(
    protected router: Router,
    protected authService: AuthService,
  ) {}

  ngAfterViewInit() {
    const maxLengthItem =
      [...this.items].sort((a, b) => b.name.length - a.name.length).pop()?.name
        .length || 'Войти'.length;
    const menuPadding = 10;
    const menuItemPadding = 6;
    const iconSize = 24;
    const iconMargin = 12;
    const fontSize = 16;

    this.hoverWidth =
      menuPadding * 2 +
      menuItemPadding * 2 +
      iconSize +
      iconMargin +
      maxLengthItem * fontSize;
  }

  protected onMouseEnter() {
    this.menuRef.nativeElement.style.width = this.hoverWidth + 'px';
  }

  protected onMouseLeave() {
    this.menuRef.nativeElement.style.width = this.initialWidth + 'px';
  }

  protected auth(): void {
    const authService = this.authService;
    const req$ = authService.isAuthorized
      ? authService.logout()
      : of(void 0).pipe(tap(() => this.router.navigate(['/auth'])));

    req$.subscribe();
  }
}
