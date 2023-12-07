import { Directive, HostListener } from '@angular/core';
import { BaseButtonDirective } from '@app/shared/directives/buttons/base-button.directive';
import { PlainObject } from '@ngxs/store/internals';
import { MatButton } from '@angular/material/button';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { takeUntil } from 'rxjs';
import { DestroyService } from '@app/core/services/destroy.service';
import * as _ from 'lodash';

@Directive({
  selector: 'button[appClearFormButton]',
})
export class ClearFormButtonDirective<
  T extends PlainObject,
> extends BaseButtonDirective {
  readonly iconClass = 'icon-close';
  readonly text = 'Очистить';
  readonly altColor = true;

  constructor(
    button: MatButton,
    protected formRef: FormEditorDirective<T>,
    private destroy$: DestroyService,
  ) {
    super(button);
  }

  ngOnInit() {
    const formRef = this.formRef;

    this.setDisabledState();
    this.button._elementRef.nativeElement.style.display = formRef.readOnly
      ? 'none'
      : 'block';
    formRef.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.setDisabledState());

    super.ngOnInit();
  }

  private setDisabledState(): void {
    const isEmpty = !_.values(this.formRef.form.value).some((field) => !!field);

    this.button.disabled = isEmpty || this.formRef.readOnly;
  }

  @HostListener('click')
  onCreateClick(): void {
    this.formRef.clear();
  }
}
