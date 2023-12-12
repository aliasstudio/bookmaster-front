import { NgModule } from '@angular/core';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { SharedModule } from '@app/shared/shared.module';
import { ReportsTurnoverPageComponent } from './reports-turnover-page/reports-turnover-page.component';
import { BookHistoryPageComponent } from '@app/reports/book-history-page/book-history-page.component';

@NgModule({
  declarations: [
    ReportsPageComponent,
    ReportsTurnoverPageComponent,
    BookHistoryPageComponent,
  ],
  imports: [SharedModule, ReportsRoutingModule],
})
export class ReportsModule {}
