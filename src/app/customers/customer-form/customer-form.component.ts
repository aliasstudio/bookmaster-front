import {Component} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { FormControlMap } from '@app/core/models/form-control-map';
import { Customer } from "@app/customers/models/customer";

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent extends FormEditorDirective<Customer> {

  resolveForm(): FormControlMap<Customer> {
    return {
      id: new FormControl(this.entity?.id),
      name: new FormControl(this.entity?.name, Validators.required),
      phone: new FormControl(this.entity?.phone, Validators.pattern('(\\+7|8)[0-9]{10}')),
      address: new FormControl(this.entity?.address, Validators.required),
      city: new FormControl(this.entity?.city, Validators.required),
      zip: new FormControl(this.entity?.zip, Validators.pattern('[0-9]{6}')),
      email: new FormControl(this.entity?.email, Validators.email)
    };
  }
}
