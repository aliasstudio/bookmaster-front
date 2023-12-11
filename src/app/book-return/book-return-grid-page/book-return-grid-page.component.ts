import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { Issue } from '@app/shared/models/issue';

@Component({
  selector: 'app-book-return-grid-page',
  templateUrl: './book-return-grid-page.component.html',
  styleUrls: ['./book-return-grid-page.component.scss'],
})
export class BookReturnGridPageComponent
  extends MatDatatableControlComponent<Issue>
  implements OnChanges
{
  @Input()
  title: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataBinding']) {
      this.bindData();
    }
  }
}
