import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorPageComponent } from "@app/authors/author-page/author-page.component";

const routes: Routes = [
  {
    path: '',
    component: AuthorPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorsRoutingModule { }
