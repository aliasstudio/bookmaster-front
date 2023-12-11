import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserProtected } from '@app/auth/models/user-proteted';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { FormControlMap } from '@app/core/models/interfaces';
import { provideFormEditor } from '@app/core/utils/functions';
import { Roles } from '@app/auth/models/roles';
import { TEXT } from '@app/core/utils/patterns';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [provideFormEditor(UserFormComponent)],
})
export class UserFormComponent extends FormEditorDirective<UserProtected> {
  showPassword = false;
  roles = Roles;

  get isNew(): boolean {
    return !this.entity?.login;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  resolveForm(): FormControlMap<UserProtected> {
    const fieldValidators = [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(16),
      Validators.pattern(TEXT),
    ];

    return {
      login: new FormControl(
        { value: null, disabled: this.isPristine },
        fieldValidators,
      ),
      lastName: new FormControl(null, fieldValidators),
      firstName: new FormControl(null, fieldValidators),
      secondName: new FormControl(null, fieldValidators),
      roles: new FormControl(null, Validators.required),
      password: new FormControl(null, [
        this.isNew ? Validators.required : Validators.nullValidator,
        Validators.minLength(2),
        Validators.maxLength(64),
      ]),
    };
  }

  ngOnInit(): void {
    super.ngOnInit();

    const formControls = this.formControls;

    if (this.isPristine) {
      this.entity.password = null;
      formControls.password.reset();
    }

    this.entityChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isPristine && formControls.login.disable();
    });
  }
}
