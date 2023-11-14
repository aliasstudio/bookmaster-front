import {Component} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { Customer } from "@app/customers/models/customer";
import { FormControlMap } from "@app/core/models/interfaces";
import { provideFormEditor } from "@app/core/utils/functions";

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  providers: [provideFormEditor(CustomerFormComponent)],
})
export class CustomerFormComponent extends FormEditorDirective<Customer> {

  resolveForm(): FormControlMap<Customer> {
    return {
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.pattern('(\\+7|8)[0-9]{10}')),
      address: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      zip: new FormControl(null, Validators.pattern('[0-9]{6}')),
      email: new FormControl(null, Validators.email)
    };
  }
}
