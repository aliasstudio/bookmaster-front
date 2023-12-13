import {
  ComponentRef,
  Directive,
  Input,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DestroyService } from '@app/core/services/destroy.service';
import { takeUntil, tap } from 'rxjs';
import { PaginatorPageInputComponent } from '@app/shared/components/paginator-page-input/paginator-page-input.component';
import * as _ from 'lodash';

@Directive({
  selector: 'mat-paginator',
  providers: [DestroyService],
})
export class MatPaginatorCustomizeDirective implements OnInit {
  constructor(
    protected paginator: MatPaginator,
    private renderer: Renderer2,
    private destroy$: DestroyService,
    private viewContainerRef: ViewContainerRef,
  ) {}

  @Input()
  pageSizeOptions: number[];

  private pageInput: ComponentRef<PaginatorPageInputComponent>;

  ngOnInit(): void {
    if (!this.pageSizeOptions) this.paginator.pageSizeOptions = [10, 20, 50];
    this.paginator.pageSize = 10;

    this.paginator._intl.nextPageLabel = 'Следующая';
    this.paginator._intl.previousPageLabel = 'Предыдущая';
    this.paginator._intl.itemsPerPageLabel = 'Показывать на странице';
    this.paginator._intl.getRangeLabel = this.getRangeLabel;

    this.paginator._intl.changes.next();
    this.initInput();
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

  private initInput() {
    const input = this.viewContainerRef.createComponent(
      PaginatorPageInputComponent,
    );
    this.pageInput = input;
    const actionsContainer =
      this.viewContainerRef.element.nativeElement.querySelector(
        '.mat-mdc-paginator-range-actions',
      );
    const btNextPage = actionsContainer.querySelector(
      '.mat-mdc-paginator-navigation-next',
    );
    this.renderer.insertBefore(
      actionsContainer,
      input.location.nativeElement,
      btNextPage,
    );

    this.updatePageInput(this.paginator);

    input.instance.observable$
      .pipe(
        tap((value) => this.setPageIndex(value - 1)),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.paginator.page
      .pipe(
        tap((e) => this.updatePageInput(e)),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private updatePageInput(event: PageEvent) {
    const input = this.pageInput.instance;
    input.max = this.paginator.getNumberOfPages();
    input.value = event.pageIndex + 1;
  }

  private setPageIndex(index: number) {
    const maxIndex = this.paginator.getNumberOfPages() - 1;
    index = _.clamp(index, 0, maxIndex);
    this.paginator.pageIndex = index;
    this.paginator.page.next({
      pageIndex: index,
      length: this.paginator.length,
      pageSize: this.paginator.pageSize,
      previousPageIndex: this.paginator.pageIndex,
    });
  }
}
