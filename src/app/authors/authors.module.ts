import { NgModule } from '@angular/core';

import { AuthorsRoutingModule } from './authors-routing.module';
import { AuthorPageComponent } from './author-page/author-page.component';
import { AuthorFormComponent } from './author-form/author-form.component';
import { SharedModule } from "@app/shared/shared.module";


@NgModule({
  declarations: [
    AuthorPageComponent,
    AuthorFormComponent
  ],
  imports: [
    AuthorsRoutingModule,
    SharedModule
  ]
})
export class AuthorsModule { }
