import { Directive, HostBinding, HostListener } from '@angular/core';
import { BaseButtonDirective } from '@app/shared/directives/buttons/base-button.directive';
import { PlainObject } from '@ngxs/store/internals';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { MatButton } from '@angular/material/button';
import { DestroyService } from '@app/core/services/destroy.service';
import { take, takeUntil } from 'rxjs';

@Directive({
  selector: 'button[appSaveFormButton]',
})
export class SaveFormButtonDirective<
  T extends PlainObject,
> extends BaseButtonDirective {
  @HostBinding('class.ms-auto')
  readonly alignClass = true;

  constructor(
    button: MatButton,
    private formRef: FormEditorDirective<T>,
    private destroy$: DestroyService,
  ) {
    super(button);
  }

  ngOnInit(): void {
    this.setButtonText();
    this.setDisabledState();

    this.formRef.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.setDisabledState());

    this.formRef.entityChanges
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        this.setButtonText();
        this.renderButton();
      });

    super.ngOnInit();
  }

  private setDisabledState(): void {
    this.button.disabled = !this.formRef.canSave;
  }

  private setButtonText(): void {
    this.text = this.formRef.isNew ? 'Создать' : 'Сохранить';
  }

  @HostListener('click')
  onCreateClick(): void {
    this.formRef.save();
  }
}
