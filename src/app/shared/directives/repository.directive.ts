import {
  AfterViewInit,
  Directive,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { PlainObject } from '@ngxs/store/internals';
import { DestroyService } from '@app/core/services/destroy.service';
import { takeUntil } from 'rxjs';
import { CustomRequestOptions } from '@app/shared/models/databinding';

@Directive()
export class RepositoryDirective<T extends PlainObject>
  implements AfterViewInit
{
  @ViewChild('form') form: TemplateRef<any>;
  @ViewChild(MatDatatableControlComponent)
  grid: MatDatatableControlComponent<T>;

  selectedItem: T | null;

  constructor(protected destroy$: DestroyService) {}

  ngAfterViewInit(): void {
    this.grid.selectedItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity) => (this.selectedItem = entity));
  }

  save(item: T, customRequestOptions?: CustomRequestOptions): void {
    this.grid.save(item, customRequestOptions);
  }
}
