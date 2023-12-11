import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { Issue } from '@app/shared/models/issue';

@Component({
  selector: 'app-book-history-grid-page',
  templateUrl: './book-history-grid-page.component.html',
  styleUrls: ['./book-history-grid-page.component.scss'],
})
export class BookHistoryGridPageComponent
  extends MatDatatableControlComponent<Issue>
  implements OnChanges
{
  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataBinding']) {
      this.bindData();
    }
  }
}
