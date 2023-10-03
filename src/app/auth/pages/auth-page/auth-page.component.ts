import {Component, OnDestroy} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from "rxjs";
import { User } from "@app/auth/models/user";

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnDestroy {
  form = this.formBuilder.group({
    login: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  showPassword = false;

  subscription = new Subscription();

  constructor(
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

    const subscription = this.auth
      .login(form.controls.login.value, form.controls.password.value)
      .subscribe();

    this.subscription.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
