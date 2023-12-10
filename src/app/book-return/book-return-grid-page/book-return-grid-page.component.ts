import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {
  MatDatatableControlComponent
} from "@app/shared/components/mat-datatable-control/mat-datatable-control.component";
import { Issue } from "@app/shared/models/issue";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: 'app-book-return-grid-page',
  templateUrl: './book-return-grid-page.component.html',
  styleUrls: ['./book-return-grid-page.component.scss']
})
export class BookReturnGridPageComponent extends MatDatatableControlComponent<Issue> implements OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input()
  title: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataBinding']) {
      this.bindData();
    }
  }
}
