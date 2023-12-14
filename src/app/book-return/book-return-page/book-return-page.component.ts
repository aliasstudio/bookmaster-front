import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, of, switchMap, takeUntil } from 'rxjs';
import { DestroyService } from '@app/core/services/destroy.service';
import { Customer } from '@app/customers/models/customer';
import { Book } from '@app/shared/models/book';
import { Issue } from '@app/shared/models/issue';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { DialogLendBookComponent } from '@app/book-return/dialog-lend-book/dialog-lend-book.component';
import { DialogReturnBookComponent } from '@app/book-return/dialog-return-book/dialog-return-book.component';
import { Page } from '@app/shared/models/page';
import { DialogExtendBookComponent } from '@app/book-return/dialog-extend-book/dialog-extend-book.component';
import { EntityRemoteDataBinding } from '@app/shared/models/databinding';
import { addDays } from 'date-fns';

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
export class BookReturnPageComponent implements OnInit {
  @ViewChild('actualGrid')
  actualGrid: MatDatatableControlComponent<Issue>;
  @ViewChild('historyGrid')
  historyGrid: MatDatatableControlComponent<Issue>;

  lendButtonDisabled = true;
  returnButtonDisabled = true;
  extendButtonDisabled = true;

  get hasData(): boolean {
    return this.actualGrid?.hasData || this.historyGrid?.hasData;
  }

  customer: Customer;
  book: Book;

  constructor(
    private http: HttpClient,
    private destroy$: DestroyService,
    public dialog: MatDialog,
  ) {}

  actualDataBinding: EntityRemoteDataBinding<Issue>;
  historyDataBinding: EntityRemoteDataBinding<Issue>;

  ngOnInit(): void {
    this.actualDataBinding = {
      urlRoot: 'issue/actual',
      columns: [
        { name: 'ID', key: 'id' },
        // { name: 'Клиент', key: 'customer' },
        { name: 'Книга', key: 'book', customTemplate: true },
        { name: 'Дата выдачи', key: 'dateOfIssue' },
        { name: 'Дата возврата', key: 'dateOfReturn' },
        { name: 'Вернуть до', key: 'returnUntil' },
      ],
    };

    this.historyDataBinding = {
      urlRoot: 'issue/history',
      columns: [
        { name: 'ID', key: 'id' },
        // { name: 'Клиент', key: 'customer' },
        { name: 'Книга', key: 'book', customTemplate: true },
        { name: 'Дата выдачи', key: 'dateOfIssue' },
        { name: 'Дата возврата', key: 'dateOfReturn' },
        { name: 'Вернуть до', key: 'returnUntil' },
      ],
    };
  }

  public findCustomer(customerId: string): void {
    this.http
      .get(`customer/${customerId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((customer: Customer) => {
        this.customer = customer;
        this.updateTables(customer.name);
      });
  }

  public findBook(bookId: string) {
    this.http
      .get(`book/${bookId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((book: Book) => {
        this.book = book;
        this.setButtonsAccessibility();
      });
  }

  async setButtonsAccessibility() {
    const actualIssuesByCustomerName = await (lastValueFrom(
      this.http.get(`issue/actual?filter=${this.customer.name}`),
    ) as Promise<Page<Issue>>);
    const actualIssuesByBookId = await (lastValueFrom(
      this.http.get(`issue/actual?filter=${this.book.uuid}`),
    ) as Promise<Page<Issue>>);
    this.returnButtonDisabled = !actualIssuesByCustomerName.content.find(
      (issue) =>
        issue.customer.id === this.customer.id &&
        issue.book.uuid === this.book.uuid,
    );
    this.extendButtonDisabled = this.returnButtonDisabled;
    this.lendButtonDisabled = actualIssuesByBookId.content.length > 0;
  }

  lendBook() {
    const dialogRef = this.dialog.open(DialogLendBookComponent, {
      data: { dateOfIssue: new Date(), returnUntil: addDays(new Date(), 21) },
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
    const dataSource = this.actualGrid.dataSource.data;
    const data = [...(dataSource.length ? dataSource : [])];
    const issue = data.find(
      (item) => !item.dateOfReturn && item.book.uuid === this.book.uuid,
    );

    const dialogRef = this.dialog.open(DialogReturnBookComponent, {
      data: { dateOfReturn: null, minDate: issue?.dateOfIssue },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (!result) return of(null);
          const { dateOfReturn } = result;
          const dataSource = this.actualGrid.dataSource.data;
          const data = [...(dataSource.length ? dataSource : [])];
          const issue = data.find(
            (item) => !item.dateOfReturn && item.book.uuid === this.book.uuid,
          );

          return this.http.put(`issue/${issue.id}`, {
            ...issue,
            dateOfReturn,
            customer: { id: this.customer?.id },
            book: { uuid: this.book?.uuid, title: this.book?.title },
          });
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.updateTables(this.customer.name));
  }

  extendBook() {
    const dataSource = this.actualGrid.dataSource.data;
    const data = [...(dataSource.length ? dataSource : [])];
    const issue = data.find(
      (item) => !item.dateOfReturn && item.book.uuid === this.book.uuid,
    );
    const dialogRef = this.dialog.open(DialogExtendBookComponent, {
      data: { returnUntil: null, minDate: issue?.returnUntil },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (!result) return of(null);
          const { returnUntil } = result;
          const dataSource = this.actualGrid.dataSource.data;
          const data = [...(dataSource.length ? dataSource : [])];
          const issue = data.find(
            (item) => !item.dateOfReturn && item.book.uuid === this.book.uuid,
          );

          return this.http.put(`issue/${issue.id}`, {
            ...issue,
            returnUntil,
            customer: { id: this.customer?.id },
            book: { uuid: this.book?.uuid, title: this.book?.title },
          });
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.updateTables(this.customer.name));
  }

  protected updateTables(customerName = '') {
    this.setButtonsAccessibility();
    this.actualGrid.bindData(customerName);
    this.historyGrid.bindData(customerName);
  }
}
