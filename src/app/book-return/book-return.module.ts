import { NgModule } from '@angular/core';
import { BookReturnRoutingModule } from './book-return-routing.module';
import { BookReturnPageComponent } from './book-return-page/book-return-page.component';
import { SharedModule } from '@app/shared/shared.module';
import { DialogLendBookComponent } from '@app/book-return/dialog-lend-book/dialog-lend-book.component';
import { DialogReturnBookComponent } from './dialog-return-book/dialog-return-book.component';
import { DialogExtendBookComponent } from './dialog-extend-book/dialog-extend-book.component';

@NgModule({
  declarations: [
    BookReturnPageComponent,
    DialogLendBookComponent,
    DialogReturnBookComponent,
    DialogExtendBookComponent,
  ],
  imports: [BookReturnRoutingModule, SharedModule],
})
export class BookReturnModule {}
