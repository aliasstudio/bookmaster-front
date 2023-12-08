import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {
  MatDatatableControlComponent
} from "@app/shared/components/mat-datatable-control/mat-datatable-control.component";
import { Issue } from "@app/shared/models/issue";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: 'app-book-history-grid-page',
  templateUrl: './book-history-grid-page.component.html',
  styleUrls: ['./book-history-grid-page.component.scss']
})
export class BookHistoryGridPageComponent extends MatDatatableControlComponent<Issue> implements OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataBinding']) {
      this.bindData();
    }
  }
}
