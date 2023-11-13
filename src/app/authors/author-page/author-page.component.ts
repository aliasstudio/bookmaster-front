import { Component } from '@angular/core';
import { RepositoryDirective } from "@app/shared/directives/repository.directive";
import { Author } from "@app/shared/models/author";
import { EntityRemoteDataBinding } from "@app/shared/models/databinding";
import { DestroyService } from "@app/core/services/destroy.service";

@Component({
  selector: 'app-author-page',
  templateUrl: './author-page.component.html',
  styleUrls: ['./author-page.component.scss'],
  providers: [DestroyService],
})
export class AuthorPageComponent extends RepositoryDirective<Author> {

  dataBinding: EntityRemoteDataBinding<Author> = {
    idField: 'uuid',
    urlRoot: 'author',
    columns: [
      { name: 'ID', key: 'uuid' },
      { name: 'ФИО', key: 'name' },
      { name: 'Биография', key: 'bio' },
      { name: 'Дата рождения', key: 'birthDate' },
      { name: 'Дата смерти', key: 'deathDate' },
      { name: 'Википедия', key: 'wikipedia' }
    ],
  };
}
