import { Component, ViewChild } from '@angular/core';
import {
  MatDatatableControlComponent
} from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { HttpClient } from '@angular/common/http';
import { of, switchMap, takeUntil } from 'rxjs';
import { DestroyService } from '@app/core/services/destroy.service';
import { Customer } from '@app/customers/models/customer';
import { Book } from '@app/shared/models/book';
import { DataBinding, } from '@app/shared/models/databinding';
import { Issue } from '@app/shared/models/issue';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { DialogLendBookComponent } from '@app/book-return/dialog-lend-book/dialog-lend-book.component';
import { DialogReturnBookComponent } from '@app/book-return/dialog-return-book/dialog-return-book.component';
import { Page } from '@app/shared/models/page';
import { BookReturnGridPageComponent } from '@app/book-return/book-return-grid-page/book-return-grid-page.component';
import { DialogExtendBookComponent } from '@app/book-return/dialog-extend-book/dialog-extend-book.component';

@Component({
  selector: 'app-book-return-page',
  templateUrl: './book-return-page.component.html',
  styleUrls: ['./book-return-page.component.scss'],
  providers: [
    MatDatatableControlComponent,
    MatSidenavContainer,
    DestroyService,
  ],
})
export class BookReturnPageComponent {
  @ViewChild('actualGrid')
  actualGrid: BookReturnGridPageComponent;

  @ViewChild('historyGrid')
  historyGrid: BookReturnGridPageComponent;

  get isCustomerAndBookSelected(): boolean {
    return !!(this.customer?.id && this.book?.uuid);
  }

  customer: Customer;
  book: Book;

  constructor(
    private http: HttpClient,
    private destroy$: DestroyService,
    public dialog: MatDialog,
  ) {}

  actualDataBinding: DataBinding<Issue> = {
    urlRoot: 'issue/actual',
    columns: [
      { name: 'ID', key: 'id' },
      // { name: 'Клиент', key: 'customer' },
      { name: 'Книга', key: 'book' },
      { name: 'Дата выдачи', key: 'dateOfIssue' },
      { name: 'Дата возврата', key: 'dateOfReturn' },
      { name: 'Вернуть до', key: 'returnUntil' },
    ],
  };

  historyDataBinding: DataBinding<Issue> = {
    urlRoot: 'issue/history',
    columns: [
      { name: 'ID', key: 'id' },
      // { name: 'Клиент', key: 'customer' },
      { name: 'Книга', key: 'book' },
      { name: 'Дата выдачи', key: 'dateOfIssue' },
      { name: 'Дата возврата', key: 'dateOfReturn' },
      { name: 'Вернуть до', key: 'returnUntil' },
    ],
  };

  public findCustomer(customerId: string): void {
    // const [historyUrl] = (
    //   this.historyDataBinding as EntityRemoteDataBinding<Issue>
    // ).urlRoot.split('?');
    // const [actualUrl] = (
    //   this.actualDataBinding as EntityRemoteDataBinding<Issue>
    // ).urlRoot.split('?');

    this.http
      .get(`customer/${customerId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((customer: Customer) => {
        this.customer = customer;

        this.updateTables(customer.name);

        //
        // this.historyDataBinding = {
        //   ...this.historyDataBinding,
        //   urlRoot: historyUrl + `?filter=${customer.name}`,
        // } as DataBinding<Issue>;
        //
        // this.actualDataBinding = {
        //   ...this.actualDataBinding,
        //   urlRoot: actualUrl + `?filter=${customer.name}`,
        // } as DataBinding<Issue>;
      });
  }

  public findBook(bookId: string) {
    this.http
      .get(`book/${bookId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((book: Book) => {
        this.book = book;
      });
  }

  lendBook() {
    const dialogRef = this.dialog.open(DialogLendBookComponent, {
      data: { dateOfIssue: null, returnUntil: null },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (!result) return of(null);

          const { dateOfIssue, returnUntil } = result;
          return this.http.post('issue', {
            dateOfIssue,
            returnUntil,
            dateOfReturn: null,
            customer: { id: this.customer?.id },
            book: { uuid: this.book?.uuid, title: this.book?.title },
          });
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.updateTables(this.customer.name));
  }

  returnBook() {
    const dialogRef = this.dialog.open(DialogReturnBookComponent, {
      data: { dateOfReturn: null },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (!result) return of(null);
          const { dateOfReturn } = result;
          return this.http.get(`issue?filter=${this.book.uuid}`).pipe(
            switchMap(({ content }: Page<Issue>) => {
              const [issue] = content;

              return this.http.put(`issue/${issue.id}`, {
                ...issue,
                dateOfReturn,
                customer: { id: this.customer?.id },
                book: { uuid: this.book?.uuid, title: this.book?.title },
              });
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.updateTables(this.customer.name));
  }

  extendBook() {
    const dialogRef = this.dialog.open(DialogExtendBookComponent, {
      data: { returnUntil: null },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (!result) return of(null);
          const { returnUntil } = result;
          return this.http.get(`issue?filter=${this.book.uuid}`).pipe(
            switchMap(({ content }: Page<Issue>) => {
              const [issue] = content;

              return this.http.put(`issue/${issue.id}`, {
                ...issue,
                returnUntil,
                customer: { id: this.customer?.id },
                book: { uuid: this.book?.uuid, title: this.book?.title },
              });
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.updateTables(this.customer.name));
  }

  private updateTables(customerName = '') {
    this.actualGrid.bindData(customerName);
    this.historyGrid.bindData(customerName);
  }
}
