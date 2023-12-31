import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { PlainObject } from '@ngxs/store/internals';
import { MatFormField } from '@angular/material/form-field';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { DestroyService } from '@app/core/services/destroy.service';
import {
  MatDatatableControlComponent
} from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';

@Component({
  selector: 'app-mat-datatable-search',
  templateUrl: './mat-datatable-search.component.html',
  styleUrls: ['./mat-datatable-search.component.scss'],
  providers: [DestroyService],
})
export class MatDatatableSearchComponent<T extends PlainObject>
  implements AfterViewInit
{
  @ViewChild(MatFormField) formField: MatFormField;
  @Input() placeholder: string = 'Введите название или ID';
  @Input() value: string;
  @Input() width: number;
  @Input() customQuery: boolean;
  @Input() disabled: boolean;
  @Output() onSearchEvent = new EventEmitter();

  search$ = new Subject<void>();

  constructor(
    private grid: MatDatatableControlComponent<T>,
    private destroy$: DestroyService,
  ) {}

  ngAfterViewInit(): void {
    const el = this.formField._elementRef.nativeElement.getElementsByClassName(
      'mat-mdc-form-field-infix',
    )[0] as HTMLElement;

    el.style.padding = '6px 0';
    el.style.minHeight = '38px';
    el.style.minWidth = this.width ? `${this.width}px` : '190px';

    this.search$
      .pipe(debounceTime(250), takeUntil(this.destroy$))
      .subscribe(() => this.search());
  }

  onkeydown(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      this.search$.next();
    }
  }

  search(): void {
    const searchText = this.formField._formFieldControl.value;
    this.onSearchEvent.emit(searchText);

    !this.customQuery && this.grid.bindData(searchText);
  }
}
