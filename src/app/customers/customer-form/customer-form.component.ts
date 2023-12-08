import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { Customer } from '@app/customers/models/customer';
import { FormControlMap } from '@app/core/models/interfaces';
import { provideFormEditor } from '@app/core/utils/functions';
import { PHONE, TEXT, ZIP } from '@app/core/utils/patterns';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  providers: [provideFormEditor(CustomerFormComponent)],
})
export class CustomerFormComponent extends FormEditorDirective<Customer> {
  resolveForm(): FormControlMap<Customer> {
    const fieldValidators = [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(32),
    ];

    return {
      name: new FormControl(null, [
        ...fieldValidators,
        Validators.pattern(TEXT),
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(PHONE),
      ]),
      address: new FormControl(null, [
        ...fieldValidators,
        Validators.maxLength(224),
      ]),
      city: new FormControl(null, fieldValidators),
      zip: new FormControl(null, [
        Validators.required,
        Validators.pattern(ZIP),
      ]),
      email: new FormControl(null, Validators.email),
    };
  }
}
