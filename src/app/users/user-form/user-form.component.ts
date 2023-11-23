import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserProtected } from '@app/auth/models/user-proteted';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { FormControlMap } from '@app/core/models/interfaces';
import { provideFormEditor } from '@app/core/utils/functions';
import { Roles } from '@app/auth/models/roles';

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
    const isNew = this.isNew;

    return {
      login: new FormControl(
        { value: null, disabled: !isNew },
        Validators.required,
      ),
      lastName: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      secondName: new FormControl(null, Validators.required),
      roles: new FormControl(null, Validators.required),
      password: new FormControl(null, isNew ? Validators.required : null),
    };
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.isPristine) {
      this.entity.password = null;
      this.formControls.password.reset();
    }
  }
}
