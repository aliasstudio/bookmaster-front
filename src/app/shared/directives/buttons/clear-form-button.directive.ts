import { Directive, HostListener } from '@angular/core';
import { BaseButtonDirective } from '@app/shared/directives/buttons/base-button.directive';
import { PlainObject } from '@ngxs/store/internals';
import { MatButton } from '@angular/material/button';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';

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
  ) {
    super(button);
  }

  @HostListener('click')
  onCreateClick(): void {
    this.formRef.clear();
  }
}
