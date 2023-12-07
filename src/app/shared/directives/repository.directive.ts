import {
  AfterViewInit,
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDatatableControlComponent } from '@app/shared/components/mat-datatable-control/mat-datatable-control.component';
import { PlainObject } from '@ngxs/store/internals';
import { DestroyService } from '@app/core/services/destroy.service';
import { takeUntil } from 'rxjs';
import { CustomRequestOptions } from '@app/shared/models/databinding';
import * as _ from 'lodash';
import { ActivatedRoute, Data } from '@angular/router';
import { hasEditPrivilege } from '@app/core/utils/functions';
import { Store } from '@ngxs/store';
import { AppState } from '@app/store/app.state';

@Directive()
export class RepositoryDirective<T extends PlainObject>
  implements OnInit, AfterViewInit
{
  @ViewChild('form') form: TemplateRef<any>;
  @ViewChild(MatDatatableControlComponent)
  grid: MatDatatableControlComponent<T>;

  selectedItem: T | null;
  readonly routeData: Data;

  @Input() readOnly: boolean;

  get isNew(): boolean {
    return !_.get(this.selectedItem, this.grid.dataBinding?.idField || 'id');
  }

  constructor(
    protected destroy$: DestroyService,
    private store: Store,
    private route: ActivatedRoute,
  ) {
    this.routeData = this.route.snapshot.data;
  }

  ngOnInit(): void {
    const isReadOnly = !hasEditPrivilege(
      this.routeData.registryKey,
      this.store.selectSnapshot(AppState.getAvailableRegistries),
    );
    this.readOnly ||= isReadOnly;
  }

  ngAfterViewInit(): void {
    this.grid.selectedItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity) => (this.selectedItem = entity));
  }

  save(item: T, customRequestOptions?: CustomRequestOptions): void {
    this.grid.save(item, customRequestOptions);
  }
}
