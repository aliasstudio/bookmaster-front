import { Directive, HostListener, Input } from '@angular/core';
import { PlainObject } from '@ngxs/store/internals';
import { BaseButtonDirective } from '@app/shared/directives/buttons/base-button.directive';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { MatButton } from '@angular/material/button';

@Directive({
  selector: 'button[appExportButton]',
})
export class ExportButtonDirective<
  T extends PlainObject,
> extends BaseButtonDirective {
  readonly iconClass = 'icon-document';
  readonly text = 'Экспорт';

  @Input() fileName?: string;

  constructor(
    button: MatButton,
    protected grid: MatDatatableControlComponent<T>,
  ) {
    super(button);
  }

  @HostListener('click')
  onClick(): void {
    this.grid.export(this.fileName);
  }
}
