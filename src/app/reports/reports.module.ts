import { NgModule } from '@angular/core';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { SharedModule } from '@app/shared/shared.module';
import { ReportsTurnoverPageComponent } from './reports-turnover-page/reports-turnover-page.component';

@NgModule({
  declarations: [ReportsPageComponent, ReportsTurnoverPageComponent],
  imports: [SharedModule, ReportsRoutingModule],
})
export class ReportsModule {}
