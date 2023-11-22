import { NgModule } from '@angular/core';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { SharedModule } from "@app/shared/shared.module";


@NgModule({
  declarations: [
    ReportsPageComponent,
  ],
  imports: [
    SharedModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
