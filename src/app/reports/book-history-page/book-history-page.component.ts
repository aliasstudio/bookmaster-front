import { Component, inject, ViewChild } from '@angular/core';
import { Issue } from "@app/shared/models/issue";
import {
  MatDatatableControlComponent
} from "@app/shared/components/mat-datatable-control/mat-datatable-control.component";
import { DestroyService } from "@app/core/services/destroy.service";
import { MatSidenavContainer } from "@angular/material/sidenav";
import { HttpClient } from "@angular/common/http";
import { DataBinding, EntityRemoteDataBinding } from "@app/shared/models/databinding";
import { BookHistoryGridPageComponent } from "@app/reports/book-history-grid-page/book-history-grid-page.component";
import { Book } from "@app/shared/models/book";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: 'app-book-history-page',
  templateUrl: './book-history-page.component.html',
  styleUrls: ['./book-history-page.component.scss'],
  providers: [DestroyService, MatSidenavContainer, MatDatatableControlComponent],
})
export class BookHistoryPageComponent {

  @ViewChild(BookHistoryGridPageComponent) grid: BookHistoryGridPageComponent;

  http = inject(HttpClient);
  destroy$ = inject(DestroyService);

  isContentVisible = false;

  dataBinding: DataBinding<Issue> = {
    urlRoot: 'issue/history?filter=',
    columns: [
      // { name: 'ID', key: 'id' },
      { name: 'Клиент', key: 'customer' },
      { name: 'Дата выдачи', key: 'dateOfIssue' },
      { name: 'Дата возврата', key: 'dateOfReturn' },
      // { name: 'Вернуть до', key: 'returnUntil' },
      // { name: 'Книга', key: 'book' },
    ],
  };

  get book(): Book {
    if (this.grid?.dataSource?.data.length > 0) {
      return (this.grid?.dataSource as MatTableDataSource<Issue>)?.data?.[0].book;
    }
    return {} as Book;
  }

  updateRecords(text: string) {
    const [url] = (this.dataBinding as EntityRemoteDataBinding<Issue>).urlRoot.split('?');

    this.dataBinding = {
      ...this.dataBinding,
      urlRoot: url + `?filter=${text}`,
    } as DataBinding<Issue>;
  }
}
