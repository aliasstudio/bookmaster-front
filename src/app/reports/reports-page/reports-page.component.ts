import { Component } from '@angular/core';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { DestroyService } from '@app/core/services/destroy.service';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss'],
  providers: [MatDatatableControlComponent, DestroyService],
})
export class ReportsPageComponent {}
