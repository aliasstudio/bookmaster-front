import { Component, inject, ViewChild } from '@angular/core';
import { Issue } from '@app/shared/models/issue';
import { EntityRemoteDataBinding } from '@app/shared/models/databinding';
import { Book } from '@app/shared/models/book';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { HttpClient } from '@angular/common/http';
import { DestroyService } from '@app/core/services/destroy.service';
import { lastValueFrom, takeUntil } from 'rxjs';

@Component({
  selector: 'app-book-history-page',
  templateUrl: './book-history-page.component.html',
  styleUrls: ['./book-history-page.component.scss'],
  providers: [MatDatatableControlComponent],
})
export class BookHistoryPageComponent {
  @ViewChild(MatDatatableControlComponent)
  grid: MatDatatableControlComponent<Issue>;

  http = inject(HttpClient);
  destroy$ = inject(DestroyService);

  dataBinding: EntityRemoteDataBinding<Issue> = {
    urlRoot: 'issue/history',
    columns: [
      // { name: 'ID', key: 'id' },
      { name: 'Клиент', key: 'customer', customTemplate: true },
      { name: 'Дата выдачи', key: 'dateOfIssue' },
      { name: 'Дата возврата', key: 'dateOfReturn' },
      // { name: 'Вернуть до', key: 'returnUntil' },
      // { name: 'Книга', key: 'book' },
    ],
  };

  book: Book;
  currentImageIndex = 0;
  images?: (string | ArrayBuffer)[] = [];

  reloadBook(text: string) {
    const dataBinding = this.dataBinding;
    const [url] = dataBinding.urlRoot.split('?');

    this.dataBinding.urlRoot = url + `?filter=${text}`;
    this.grid.reloadData();

    lastValueFrom(this.http.get<Book>(`book/${text}`)).then((book) => {
      this.book = book;
      this.images = [];

      book.covers.forEach(async (cover) => {
        const blob = await lastValueFrom(
          this.http.get(`book-cover/${cover.id}`, {
            responseType: 'blob',
          }),
        );
        const reader = new FileReader();

        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          this.images.push(reader.result);
        };
      });
    });
  }

  export(): void {
    this.http
      .get('issue/export/excel', {
        responseType: 'blob',
        params: {
          filter: this.book?.id,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((file: Blob) => {
        const url = window.URL.createObjectURL(file);
        const link = document.createElement('a');

        link.setAttribute('href', url);
        link.setAttribute('download', 'test.xlsx');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }
}
