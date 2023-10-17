import { Directive, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Directive({
  selector: 'mat-paginator',
})
export class MatPaginatorCustomizeDirective implements OnInit {
  constructor(protected paginator: MatPaginator) {}

  ngOnInit(): void {
    this.paginator.pageSizeOptions = [10, 20, 50];
    this.paginator.pageSize = 10;

    this.paginator._intl.nextPageLabel = 'Следующая';
    this.paginator._intl.previousPageLabel = 'Предыдущая';
    this.paginator._intl.itemsPerPageLabel = 'Показывать на странице';
    this.paginator._intl.getRangeLabel = this.getRangeLabel;

    this.paginator._intl.changes.next();
  }

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} из ${length}`;
  };
}
