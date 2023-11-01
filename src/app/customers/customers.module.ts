import { NgModule } from '@angular/core';
import { CustomerFormComponent } from "@app/customers/customer-form/customer-form.component";
import { SharedModule } from "@app/shared/shared.module";
import { CustomersRoutingModule } from "@app/customers/customers-routing.module";
import { CustomersPageComponent } from './customers-page/customers-page.component';

@NgModule({
  declarations: [CustomersPageComponent, CustomerFormComponent],
  imports: [SharedModule, CustomersRoutingModule]
})
export class CustomersModule { }
