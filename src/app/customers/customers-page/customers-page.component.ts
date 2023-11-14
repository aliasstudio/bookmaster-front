import { Component } from '@angular/core';
import { EntityRemoteDataBinding } from '@app/shared/models/databinding';
import { RepositoryDirective } from '@app/shared/directives/repository.directive';
import { DestroyService } from '@app/core/services/destroy.service';
import { Customer } from "@app/customers/models/customer";

@Component({
  selector: 'app-customers-page',
  templateUrl: './customers-page.component.html',
  styleUrls: ['./customers-page.component.scss'],
  providers: [DestroyService],
})
export class CustomersPageComponent extends RepositoryDirective<Customer> {

  dataBinding: EntityRemoteDataBinding<Customer> = {
    urlRoot: 'customer',
    columns: [
      { name: 'ID', key: 'id' },
      { name: 'ФИО', key: 'name' },
      { name: 'Адрес', key: 'address' },
      { name: 'Почтовый индекс', key: 'zip' },
      { name: 'Город', key: 'city' },
      { name: 'Телефон', key: 'phone' },
      { name: 'Почта', key: 'email' },
    ],
  };
}
