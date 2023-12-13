import { Component, inject } from '@angular/core';
import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { Book } from '@app/shared/models/book';
import { FormControl, Validators } from '@angular/forms';
import { FormControlMap } from '@app/core/models/interfaces';
import { Author } from '@app/shared/models/author';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Page } from '@app/shared/models/page';
import { provideFormEditor } from '@app/core/utils/functions';
import { MatDialog } from '@angular/material/dialog';
import { MatDeleteDialogComponent } from '@app/shared/components/mat-delete-dialog/mat-delete-dialog.component';

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
  private dialog = inject(MatDialog);

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
      subjects: new FormControl(null),
      covers: new FormControl(null),
    };
  }

  imageAdd(e: any) {
    const file = e.target.files[0] as File; // Get the selected file
    let formData = new FormData();
    formData.append('image', file);
    formData.append('fileName', file.name);
    if (file) {
      this.http
        .post(`book-cover/add/${this.entity.uuid}`, formData)
        .pipe(
          switchMap(() =>
            this.http
              .get(`book/${this.entity.uuid}`)
              .pipe(tap((book: Book) => (this.entity = book))),
          ),
        )
        .subscribe();
    }
  }

  removeImage(imageId: number) {
    const dialog = this.dialog.open(MatDeleteDialogComponent, {
      data: {
        title: 'Вы действительно хотите удалить обложку?',
      },
    });

    dialog
      .afterClosed()
      .pipe(
        switchMap((answer) => {
          if (answer) {
            return this.http
              .delete(`book-cover/${imageId}`)
              .pipe(
                switchMap(() =>
                  this.http
                    .get(`book/${this.entity.uuid}`)
                    .pipe(tap((book: Book) => (this.entity = book))),
                ),
              );
          }

          return of(null);
        }),
      )
      .subscribe();
  }
}
