import { Directive, HostListener, Input } from '@angular/core';
import { PlainObject } from '@ngxs/store/internals';
import { BaseButtonDirective } from '@app/shared/directives/buttons/base-button.directive';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { MatButton } from '@angular/material/button';
import { DestroyService } from '@app/core/services/destroy.service';
import { takeUntil } from 'rxjs';

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
    private destroy$: DestroyService,
  ) {
    super(button);
  }

  ngOnInit(): void {
    this.grid.dataLoaded
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.setDisabledState());

    super.ngOnInit();
  }

  private setDisabledState(): void {
    this.button.disabled = !this.grid.hasData;
  }

  @HostListener('click')
  onClick(): void {
    this.grid.export(this.fileName);
  }
}
