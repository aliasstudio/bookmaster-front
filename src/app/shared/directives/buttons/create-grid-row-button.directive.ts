import { Directive, HostListener, Input } from '@angular/core';
import { BaseButtonDirective } from '@app/shared/directives/buttons/base-button.directive';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { PlainObject } from '@ngxs/store/internals';
import { MatButton } from '@angular/material/button';

@Directive({
  selector: 'button[appCreateGridRowButton]',
})
export class CreateGridRowButtonDirective<
  T extends PlainObject,
> extends BaseButtonDirective {
  readonly iconClass = 'icon-add';
  @Input() text = 'Создать';

  constructor(
    button: MatButton,
    protected grid: MatDatatableControlComponent<T>,
  ) {
    super(button);
  }

  ngOnInit() {
    super.ngOnInit();

    const readOnly = this.grid.readOnly;

    this.button.disabled = readOnly;
    this.button._elementRef.nativeElement.style.display = readOnly
      ? 'none'
      : 'block';
  }

  @HostListener('click')
  onCreateClick(): void {
    this.grid.open();
  }
}
