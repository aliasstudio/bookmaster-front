import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PlainObject } from '@ngxs/store/internals';
import { MatFormField } from '@angular/material/form-field';
import {
  MatDatatableControlComponent
} from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { HttpClient } from "@angular/common/http";
import { DestroyService } from "@app/core/services/destroy.service";

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
  @Input() placeholder: string = 'Поиск...';
  @Input() url: string;
  @Output() responseData = new EventEmitter<string>();

  constructor(protected grid: MatDatatableControlComponent<T>, private http: HttpClient, private destroy$: DestroyService) {}

  ngAfterViewInit(): void {
    const el = this.formField._elementRef.nativeElement.getElementsByClassName(
      'mat-mdc-form-field-infix',
    )[0] as HTMLElement;

    el.style.padding = '6px 0';
    el.style.minHeight = '38px';
  }

  onkeydown(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      this.search();
    }
  }

  search(): void {
    const searchText: string = this.formField._formFieldControl.value;

    this.responseData.emit(searchText);
  }
}
