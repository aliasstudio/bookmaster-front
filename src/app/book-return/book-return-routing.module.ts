import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookReturnPageComponent } from "@app/book-return/book-return-page/book-return-page.component";

const routes: Routes = [
  {
    path: '',
    component: BookReturnPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookReturnRoutingModule { }
