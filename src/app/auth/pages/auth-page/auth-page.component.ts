import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent {
  form = this.formBuilder.group({
    userName: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService,
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    const form = this.form;

    if (!form.valid) {
      this.toastr.error('Укажите логин и пароль');
      return;
    }

    this.auth
      .login(form.controls.userName.value, form.controls.password.value)
      .subscribe();
  }
}
