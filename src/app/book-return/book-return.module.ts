import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookReturnRoutingModule } from './book-return-routing.module';
import { BookReturnPageComponent } from './book-return-page/book-return-page.component';


@NgModule({
  declarations: [
    BookReturnPageComponent
  ],
  imports: [
    CommonModule,
    BookReturnRoutingModule
  ]
})
export class BookReturnModule { }
