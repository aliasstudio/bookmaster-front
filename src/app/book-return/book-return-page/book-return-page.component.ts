import { Component, OnInit } from '@angular/core';
import {
  MatDatatableControlComponent
} from "@app/shared/components/mat-datatable-control/mat-datatable-control.component";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-book-return-page',
  templateUrl: './book-return-page.component.html',
  styleUrls: ['./book-return-page.component.scss'],
  providers: [MatDatatableControlComponent],
})
export class BookReturnPageComponent implements OnInit {

  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit() {
    // this.http.get('issue?filter=Болконский Андрей Николаевич').subscribe(res => console.log(res));
    this.http.get('issue/actual').subscribe(res => console.log(res));
    // this.http.post('issue', {
    //   "dateOfIssue": "2023-12-01",
    //   "returnUntil": "2023-12-20",
    //   "dateOfReturn": "2023-12-18",
    //   "customer": {
    //     "id": "C1000",
    //   },
    //   "book": {
    //     "uuid": "B1056",
    //   }
    // }).subscribe();
  }

  public findCustomer(customerId: string): void {


    this.http.get(`customer/${customerId}`).subscribe(res => console.log(res));
  }
}
