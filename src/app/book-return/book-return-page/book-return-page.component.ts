import { Component } from '@angular/core';
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
export class BookReturnPageComponent {

  constructor(
    private http: HttpClient,
  ) {}

  public findClient(customerId: string): void {
    this.http.get(`customer/${customerId}`).subscribe(res => console.log(res));
  }
}
