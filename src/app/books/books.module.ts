import { NgModule } from '@angular/core';

import { BooksRoutingModule } from './books-routing.module';
import { BookFormComponent } from '@app/books/book-form/book-form.component';
import { BooksPageComponent } from '@app/books/books-page/books-page.component';
import { SharedModule } from "@app/shared/shared.module";


@NgModule({
  declarations: [
    BookFormComponent,
    BooksPageComponent,
  ],
    imports: [
        BooksRoutingModule,
        SharedModule
    ]
})
export class BooksModule { }
