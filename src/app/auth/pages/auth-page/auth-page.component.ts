import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap, takeUntil, tap } from 'rxjs';
import { DestroyService } from '@app/core/services/destroy.service';
import { Router } from '@angular/router';
import { RegistriesGuard } from '@app/core/guards/registries.guard';

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
    private router: Router,
    private registries: RegistriesGuard,
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
      .pipe(
        switchMap(() => this.registries.resolve()),
        tap(() => this.router.navigate(['/books'])),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }
}
