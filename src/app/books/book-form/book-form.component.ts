import { AfterViewInit, Component, inject } from '@angular/core';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { Book } from '@app/shared/models/book';
import { FormControl, Validators } from '@angular/forms';
import { FormControlMap } from '@app/core/models/interfaces';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Author } from '@app/shared/models/author';
import { Page } from '@app/shared/models/page';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
})
export class BookFormComponent
  extends FormEditorDirective<Book>
  implements AfterViewInit
{
  http = inject(HttpClient);

  authors$: Observable<Author[]>;

  get authorsFormControl(): FormControl<Author> {
    return this.formControls.authors as FormControl<Author>;
  }

  ngAfterViewInit() {
    this.authors$ = this.http
      .get('author')
      .pipe(map(({ content: authors }: Page<Author>) => authors));
  }

  resolveForm(): FormControlMap<Book> {
    return {
      id: new FormControl(null),
      title: new FormControl(null, Validators.required),
      subTitle: new FormControl(null),
      firstPublishDate: new FormControl(null),
      description: new FormControl(null),
      authors: new FormControl(null),
    };
  }
}
