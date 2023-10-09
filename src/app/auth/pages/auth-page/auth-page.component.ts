import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserProtected } from '@app/auth/models/user-proteted';
import { takeUntil } from 'rxjs';
import { DestroyService } from '@app/core/services/destroy.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  providers: [DestroyService],
})
export class AuthPageComponent {
  form = this.formBuilder.group({
    login: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  showPassword = false;

  constructor(
    private destroy$: DestroyService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService,
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login(e: Event): void {
    e.stopPropagation();

    const form = this.form;

    if (!form.valid) {
      this.toastr.error('Укажите логин и пароль');
      return;
    }

    this.auth
      .login(form.controls.login.value, form.controls.password.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  register(e: Event) {
    e.stopPropagation();

    const form = this.form;

    if (!form.valid) {
      this.toastr.error('Укажите логин и пароль');
      return;
    }

    const user: UserProtected = {
      login: form.controls.login.value,
      password: form.controls.password.value,
      firstName: 'fn',
      lastName: 'ln',
      middleName: 'mn',
    };

    this.auth.register(user).pipe(takeUntil(this.destroy$)).subscribe();
  }
}
