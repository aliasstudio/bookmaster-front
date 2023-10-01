import { Component } from '@angular/core';
import { FormBuilder, FormControl } from "@angular/forms";

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent {
  formGroup = this.formBuilder.group({
    userName: new FormControl(''),
    password: new FormControl(''),
  });

  showPassword = false;

  constructor(private formBuilder: FormBuilder) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }
  
}
