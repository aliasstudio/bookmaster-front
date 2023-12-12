import { Component, ViewChild } from '@angular/core';
import { Issue } from '@app/shared/models/issue';
import { EntityRemoteDataBinding } from '@app/shared/models/databinding';
import { Book } from '@app/shared/models/book';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';

@Component({
  selector: 'app-book-history-page',
  templateUrl: './book-history-page.component.html',
  styleUrls: ['./book-history-page.component.scss'],
  providers: [MatDatatableControlComponent],
})
export class BookHistoryPageComponent {
  @ViewChild(MatDatatableControlComponent)
  grid: MatDatatableControlComponent<Issue>;

  dataBinding: EntityRemoteDataBinding<Issue> = {
    urlRoot: 'issue/history',
    columns: [
      // { name: 'ID', key: 'id' },
      { name: 'Клиент', key: 'customer', customTemplate: true },
      { name: 'Дата выдачи', key: 'dateOfIssue' },
      { name: 'Дата возврата', key: 'dateOfReturn' },
      // { name: 'Вернуть до', key: 'returnUntil' },
      // { name: 'Книга', key: 'book' },
    ],
  };

  get book(): Book {
    if (this.grid?.dataSource?.data.length > 0) {
      return (this.grid?.dataSource as MatTableDataSource<Issue>)?.data?.[0]
        .book;
    }
    return {} as Book;
  }

  updateRecords(text: string) {
    const dataBinding = this.dataBinding;
    const [url] = dataBinding.urlRoot.split('?');

    this.dataBinding.urlRoot = url + `?filter=${text}`;
    this.grid.reloadData();
  }
}
