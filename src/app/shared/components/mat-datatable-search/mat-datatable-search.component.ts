import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { PlainObject } from '@ngxs/store/internals';
import { MatFormField } from '@angular/material/form-field';
import { SearchGridButtonDirective } from '@app/shared/directives/buttons/search-button.directive';
import { MatButton } from '@angular/material/button';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';

@Component({
  selector: 'app-mat-datatable-search',
  templateUrl: './mat-datatable-search.component.html',
  styleUrls: ['./mat-datatable-search.component.scss'],
  providers: [SearchGridButtonDirective, MatButton],
})
export class MatDatatableSearchComponent<T extends PlainObject>
  implements AfterViewInit
{
  @ViewChild(MatFormField) formField: MatFormField;
  @Input() placeholder: string = 'Поиск...';

  constructor(protected grid: MatDatatableControlComponent<T>) {}

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
    const searchText = this.formField._formFieldControl.value;
    // TODO: сделать поиск, когда будет на бэке
    //this.grid.search()
  }
}
