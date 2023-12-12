import { Directive, HostBinding, HostListener } from '@angular/core';
import { PlainObject } from '@ngxs/store/internals';
import { BaseButtonDirective } from '@app/shared/directives/buttons/base-button.directive';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { MatButton } from '@angular/material/button';

@Directive({
  selector: 'button[appReloadGridButton]',
})
export class ReloadGridButtonDirective<
  T extends PlainObject,
> extends BaseButtonDirective {
  @HostBinding('class.ms-auto')
  readonly iconClass = 'icon-reload';
  readonly text = 'Обновить';

  constructor(
    button: MatButton,
    protected grid: MatDatatableControlComponent<T>,
  ) {
    super(button);
  }

  @HostListener('click')
  onReloadClick(): void {
    this.grid.reloadData(false);
  }
}
