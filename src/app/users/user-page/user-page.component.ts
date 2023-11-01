import { Component, inject } from '@angular/core';
import { UserProtected } from '@app/auth/models/user-proteted';
import { EntityRemoteDataBinding } from '@app/shared/models/databinding';
import { RepositoryDirective } from '@app/shared/directives/repository.directive';
import { DestroyService } from '@app/core/services/destroy.service';
import { AuthService } from '@app/auth/services/auth.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  providers: [DestroyService],
})
export class UserPageComponent extends RepositoryDirective<UserProtected> {
  private authService = inject(AuthService);

  dataBinding: EntityRemoteDataBinding<UserProtected> = {
    idField: 'login',
    urlRoot: 'user',
    columns: [
      { name: 'Логин', key: 'login' },
      { name: 'Имя', key: 'firstName' },
      { name: 'Фамилия', key: 'lastName' },
      { name: 'Отчество', key: 'secondName' },
    ],
  };

  save(item: UserProtected): void {
    const isNew = this.isNew;

    this.grid.save(item, {
      req$: isNew ? this.authService.register(item) : null,
      withoutNotification: isNew,
    });
  }
}
