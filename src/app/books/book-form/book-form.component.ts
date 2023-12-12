import { Component, inject } from '@angular/core';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { Book } from '@app/shared/models/book';
import { FormControl, Validators } from '@angular/forms';
import { FormControlMap } from '@app/core/models/interfaces';
import { Author } from '@app/shared/models/author';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Page } from '@app/shared/models/page';
import { provideFormEditor } from '@app/core/utils/functions';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
  providers: [provideFormEditor(BookFormComponent)],
})
export class BookFormComponent extends FormEditorDirective<Book> {
  get isNew(): boolean {
    return !this.entity?.uuid;
  }

  authors$: Observable<Author[]>;

  private http = inject(HttpClient);

  ngOnInit(): void {
    super.ngOnInit();

    this.authors$ = this.http
      .get('author')
      .pipe(map(({ content: authors }: Page<Author>) => authors));
  }

  resolveForm(): FormControlMap<Book> {
    const fieldValidators = [Validators.minLength(2), Validators.maxLength(32)];

    return {
      title: new FormControl(null, [...fieldValidators, Validators.required]),
      subTitle: new FormControl(null, [Validators.maxLength(100)]),
      firstPublishDate: new FormControl(null, [Validators.maxLength(224)]), // FIXME: ПОЧЕМУ СТРОКА ТО ЕМАЕ
      description: new FormControl(null, [Validators.maxLength(224)]),
      authors: new FormControl(null),
    };
  }
}
