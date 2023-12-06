import { NgModule } from '@angular/core';

import { BookReturnRoutingModule } from './book-return-routing.module';
import { BookReturnPageComponent } from './book-return-page/book-return-page.component';
import { SharedModule } from "@app/shared/shared.module";


@NgModule({
  declarations: [
    BookReturnPageComponent
  ],
  imports: [
    BookReturnRoutingModule,
    SharedModule
  ]
})
export class BookReturnModule { }
