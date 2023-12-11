import { NgModule } from '@angular/core';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { SharedModule } from '@app/shared/shared.module';
import { ReportsTurnoverPageComponent } from './reports-turnover-page/reports-turnover-page.component';
import { ReportsReturnUntilColumnComponent } from '@app/reports/reports-turnover-page/reports-return-until-column/reports-return-until-column.component';

@NgModule({
  declarations: [
    ReportsPageComponent,
    ReportsTurnoverPageComponent,
    ReportsReturnUntilColumnComponent,
  ],
  imports: [
    SharedModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
