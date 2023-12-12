import { Component, inject, ViewChild } from '@angular/core';
import { Issue } from "@app/shared/models/issue";
import {
  MatDatatableControlComponent
} from "@app/shared/components/mat-datatable-control/mat-datatable-control.component";
import { DestroyService } from "@app/core/services/destroy.service";
import { MatSidenavContainer } from "@angular/material/sidenav";
import { HttpClient } from "@angular/common/http";
import { DataBinding, EntityRemoteDataBinding } from "@app/shared/models/databinding";
import { BookHistoryGridPageComponent } from "@app/reports/book-history-grid-page/book-history-grid-page.component";
import { Book } from "@app/shared/models/book";
import { lastValueFrom, takeUntil } from "rxjs";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-book-history-page',
  templateUrl: './book-history-page.component.html',
  styleUrls: ['./book-history-page.component.scss'],
  providers: [DestroyService, MatSidenavContainer, MatDatatableControlComponent],
})
export class BookHistoryPageComponent {

  @ViewChild(BookHistoryGridPageComponent) grid: BookHistoryGridPageComponent;

  http = inject(HttpClient);
  destroy$ = inject(DestroyService);

  book: Book;

  currentImageIndex = 0;

  isContentVisible = false;

  images?: (string | ArrayBuffer)[] = [];

  dataBinding: DataBinding<Issue> = {
    urlRoot: 'issue/history',
    columns: [
      // { name: 'ID', key: 'id' },
      { name: 'Клиент', key: 'customer' },
      { name: 'Дата выдачи', key: 'dateOfIssue' },
      { name: 'Дата возврата', key: 'dateOfReturn' },
      // { name: 'Вернуть до', key: 'returnUntil' },
      // { name: 'Книга', key: 'book' },
    ],
  };

  // get book(): Book {
  //   if (this.grid?.dataSource?.data.length > 0) {
  //     return (this.grid?.dataSource as MatTableDataSource<Issue>)?.data?.[0].book;
  //   }
  //   return {} as Book;
  // }

  updateRecords(text: string) {

    // this.http.get(`book-cover/1`, {
    //   responseType: "blob",
    // }).subscribe(res => {
    //   var reader = new FileReader();
    //   reader.readAsDataURL(res);
    //   reader.onloadend = () => {
    //     this.image = reader.result;
    //   }
    //
    // });


    lastValueFrom(this.http.get<Book>(`book/${text}`)).then(book => {
      // console.log(book);
      
      this.book = book;

      book.covers.forEach(async (cover) => {
        const blob = await lastValueFrom(this.http.get(`book-cover/${cover.id}`, {
          responseType: "blob",
        }));

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          this.images.push(reader.result);
        }
      });
    })

    //   this.http.get(`book-cover/6`, {
    //     responseType: "blob",
    //   }).subscribe();
    //
    // this.http.get(`book-cover/8`, {
    //   responseType: "blob",
    // }).subscribe();

    // this.http.get<Book>(`book/${text}`).pipe(
    //   switchMap((book: Book) => {
    //     this.book = book;
    //     this.grid.bindData(book.uuid);
    //     return forkJoin(book.covers.map(cover => {
    //       return this.http.get(`book-cover/${cover.id}`, {
    //         responseType: "blob",
    //       });
    //     }))
    //   }),
    //   takeUntil(this.destroy$),
    // )
    //   .subscribe((blobs: Blob[]) => {
    //     blobs.forEach(blob => {
    //       const reader = new FileReader();
    //       reader.readAsDataURL(blob);
    //       reader.onloadend = () => {
    //         this.images.push(reader.result);
    //       }
    //     })
    // });
  }

  // async getImages(text: string) {
  //   lastValueFrom(this.http.get<Book>(`book/${text}`));
  //
  // }

  export() {
    const binding = this.dataBinding as EntityRemoteDataBinding<Issue>;
    const url = binding.urlRoot;
    const subscription = this.http
      .get('issue/export/excel', {
        responseType: 'blob',
        params: {
          filter: this.book?.id,
        }
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

  prevImage() {
    // this.
  }

  log(e: PageEvent) {
    console.log(e.pageIndex);
  }
}
