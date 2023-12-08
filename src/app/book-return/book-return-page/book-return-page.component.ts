import { Component, OnInit } from '@angular/core';
import {
  MatDatatableControlComponent
} from "@app/shared/components/mat-datatable-control/mat-datatable-control.component";
import { HttpClient } from "@angular/common/http";
import { takeUntil } from "rxjs";
import { DestroyService } from "@app/core/services/destroy.service";
import { Customer } from "@app/customers/models/customer";
import { Book } from "@app/shared/models/book";
import { DataBinding, EntityRemoteDataBinding } from "@app/shared/models/databinding";
import { Issue } from "@app/shared/models/issue";
import { MatSidenavContainer } from "@angular/material/sidenav";

@Component({
  selector: 'app-book-return-page',
  templateUrl: './book-return-page.component.html',
  styleUrls: ['./book-return-page.component.scss'],
  providers: [MatDatatableControlComponent, MatSidenavContainer, DestroyService],
})
export class BookReturnPageComponent implements OnInit {

  customer: Customer;
  book: Book;

  constructor(
    private http: HttpClient,
    private destroy$: DestroyService,
  ) {}

  actualDataBinding: DataBinding<Issue> = {
    urlRoot: 'issue/actual?filter=',
    columns: [
      // { name: 'ID', key: 'id' },
      { name: 'Клиент', key: 'customer' },
      { name: 'Дата выдачи', key: 'dateOfIssue' },
      { name: 'Дата возврата', key: 'dateOfReturn' },
      // { name: 'Вернуть до', key: 'returnUntil' },
      // { name: 'Книга', key: 'book' },
    ],
  };

  historyDataBinding: DataBinding<Issue> = {
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

  ngOnInit() {
    this.http.get('issue/actual?filter=Ирина Петровна Шмелева').subscribe(res => console.log(res));
    // this.http.get('issue/actual').subscribe(res => console.log(res));

    // this.http.post('issue', {
    //   "dateOfIssue": "2023-12-01",
    //   "returnUntil": "2023-12-20",
    //   "dateOfReturn": null,
    //   "customer": {
    //     "id": "C1000",
    //   },
    //   "book": {
    //     "uuid": "B1064",
    //   }
    // }).subscribe();
  }

  public findCustomer(customerId: string): void {

    const [historyUrl] = (this.historyDataBinding as EntityRemoteDataBinding<Issue>).urlRoot.split('?');
    const [actualUrl] = (this.actualDataBinding as EntityRemoteDataBinding<Issue>).urlRoot.split('?');



    this.http.get(`customer/${customerId}`)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((customer: Customer) => {
        this.customer = customer;

        this.historyDataBinding = {
          ...this.historyDataBinding,
          urlRoot: historyUrl + `?filter=${customer.name}`,
        } as DataBinding<Issue>;

        this.actualDataBinding = {
          ...this.actualDataBinding,
          urlRoot: actualUrl + `?filter=${customer.name}`,
        } as DataBinding<Issue>;

        // return this.http.get(`issue/actual?filter=${customer.name}`)
      });
  }

  public findBook(bookId: string) {
    this.http.get(`book/${bookId}`).pipe(takeUntil(this.destroy$)).subscribe((book: Book) => {
      this.book = book;
    });
  }

  lendBook() {
    // const date = new Date();
    // const [day, month, year] = [date.getDay(), date.getMonth() + 1, date.getFullYear()];
    // const dateOfIssue = `${}-${}-${}`;

    this.http.post('issue', {
        dateOfIssue: new Date(),
        returnUntil: this.addMonths(new Date(), 1),
        dateOfReturn: null,
        customer: this.customer,
        book: this.book,
      })
      .pipe(takeUntil(this.destroy$)).subscribe();
  }

  private addMonths(date, months) {
    const d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

}
