import { Component } from '@angular/core';
import { EntityRemoteDataBinding } from "@app/shared/models/databinding";
import { RepositoryDirective } from "@app/shared/directives/repository.directive";
import { DestroyService } from "@app/core/services/destroy.service";
import { Book } from "@app/shared/models/book";

@Component({
  selector: 'app-books-page',
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.scss'],
  providers: [DestroyService],
})
export class BooksPageComponent extends RepositoryDirective<Book> {
  dataBinding: EntityRemoteDataBinding<Book> = {
    urlRoot: 'book',
    columns: [
      { name: 'ID', key: 'id' },
      { name: 'Название', key: 'title' },
      { name: 'Подзаголовок', key: 'subTitle' },
      { name: 'Первая дата публикации', key: 'firstPublishDate' },
      { name: 'Описание', key: 'description' },
    ],
  };
}
