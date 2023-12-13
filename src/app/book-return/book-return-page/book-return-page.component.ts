import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDatatableControlComponent
} from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
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
export class BookReturnPageComponent implements OnInit {
  @ViewChild('actualGrid')
  actualGrid: BookReturnGridPageComponent;

  @ViewChild('historyGrid')
  historyGrid: BookReturnGridPageComponent;

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

  actualDataBinding;

  historyDataBinding;

  ngOnInit(): void {

    this.actualDataBinding = {
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

    this.historyDataBinding = {
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
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((book: Book) => {
          this.book = book;
          this.setButtonsAccessibility();
      });
  }

  async setButtonsAccessibility() {
    const actualIssuesByCustomerName = await (lastValueFrom(this.http.get(`issue/actual?filter=${this.customer.name}`)) as Promise<Page<Issue>>);
    const actualIssuesByBookId= await (lastValueFrom(this.http.get(`issue/actual?filter=${this.book.uuid}`)) as Promise<Page<Issue>>);
    this.returnButtonDisabled = !actualIssuesByCustomerName.content.find(issue => issue.customer.id === this.customer.id && issue.book.uuid === this.book.uuid);
    this.extendButtonDisabled = this.returnButtonDisabled;
    this.lendButtonDisabled = actualIssuesByBookId.content.length > 0;
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

  protected updateTables(customerName = '') {
    this.setButtonsAccessibility();
    this.actualGrid.bindData(customerName);
    this.historyGrid.bindData(customerName);
  }


}
