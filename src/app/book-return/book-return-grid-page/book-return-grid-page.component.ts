import { Component, Input } from '@angular/core';
import {
  MatDatatableControlComponent
} from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { Issue } from '@app/shared/models/issue';

@Component({
  selector: 'app-book-return-grid-page',
  templateUrl: './book-return-grid-page.component.html',
  styleUrls: ['./book-return-grid-page.component.scss'],
})
export class BookReturnGridPageComponent
  extends MatDatatableControlComponent<Issue>
{
  @Input()
  title: string;

}
