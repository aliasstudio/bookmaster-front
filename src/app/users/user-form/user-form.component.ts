import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserProtected } from '@app/auth/models/user-proteted';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { FormControlMap } from '@app/core/models/interfaces';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent extends FormEditorDirective<UserProtected> {
  showPassword = false;

  get isNew(): boolean {
    return !this.entity?.login;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  resolveForm(): FormControlMap<UserProtected> {
    // TODO: сделать роли
    return {
      login: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      secondName: new FormControl(null, Validators.required),
      password: new FormControl(null, this.isNew ? Validators.required : null),
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
