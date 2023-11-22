import { NgModule } from '@angular/core';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { SharedModule } from "@app/shared/shared.module";
import { BookHistoryPageComponent } from './book-history-page/book-history-page.component';
import { BookHistoryGridPageComponent } from './book-history-grid-page/book-history-grid-page.component';


@NgModule({
  declarations: [
    ReportsPageComponent, 
    BookHistoryPageComponent, BookHistoryGridPageComponent,
  ],
  imports: [
    SharedModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
