import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import {
  MatColumnDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PlainObject } from '@ngxs/store/internals';
import * as _ from 'lodash';
import { Column } from '@app/shared/models/column';
import { DestroyService } from '@app/core/services/destroy.service';
import {
  DataBinding,
  EntityRemoteDataBinding,
  LocalDataBinding,
  RemoteDataBinding,
} from '@app/shared/models/databinding';
import { takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Page } from '@app/shared/models/page';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-mat-datatable',
  templateUrl: './mat-datatable.component.html',
  styleUrls: ['./mat-datatable.component.scss'],
  providers: [DestroyService],
})
export class MatDatatableComponent<T extends PlainObject>
  implements OnInit, AfterContentInit
{
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;

  @ViewChild(MatTable, { static: true }) table: MatTable<T>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input({ required: true }) dataBinding: DataBinding<T>;

  dataSource = new MatTableDataSource<T>();
  hasData?: boolean;

  protected columns: Column<T>[];
  protected columnsBind: Column<T>[];
  protected columnKeys: string[];

  private lastFilter?: string;

  constructor(
    protected destroy$: DestroyService,
    protected http: HttpClient,
    protected toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const dataBinding = this.dataBinding;

    this.columns = dataBinding.columns;
    this.columnsBind = dataBinding.columns.filter(
      (col) => !col?.customTemplate,
    );
    this.bindData();
  }

  ngAfterContentInit() {
    this.columnDefs.forEach((columnDef) => this.table.addColumnDef(columnDef));
  }

  bindData(filter?: string): void {
    this.lastFilter = filter;

    const dataBinding = this.dataBinding;

    if (_.has(dataBinding, 'loadReq$')) {
      const binding = dataBinding as RemoteDataBinding<T>;

      binding.loadReq$
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ content }) => this.setData(content));
    } else if (_.has(dataBinding, 'urlRoot')) {
      const binding = dataBinding as EntityRemoteDataBinding<T>;
      const url = filter
        ? `${binding.urlRoot}?filter=${filter}`
        : binding.urlRoot;

      this.http
        .get<Page<T>>(url, {
          params: {
            size: 100000,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ content }) => this.setData(content));
    } else {
      const binding = dataBinding as LocalDataBinding<T>;

      this.setData(binding.data);
    }
  }

  reloadData(silent = true, keepFilter = true): void {
    this.bindData(keepFilter ? this.lastFilter : null);
    !silent && this.toastr.success('Страница успешно обновлена!');
  }

  private setData(data: T[]): void {
    this.dataSource.data = data;
    this.hasData = !!data.length;
    this.onBindingComplete();
  }

  protected onBindingComplete(): void {
    const dataSource = this.dataSource;
    const entity = [...dataSource.data].pop();
    const columns = _.keys(entity).map((key) => ({
      name: key,
      key,
    }));

    this.columns ||= columns;
    this.columnKeys = [...this.columns].map((col) => col.key);

    dataSource.paginator = this.paginator;
    dataSource.sort = this.sort;
    dataSource._updateChangeSubscription();
  }

  add(item: T, withoutNotification?: boolean): void {
    const dataSource = this.dataSource;

    dataSource.data.push(item);
    dataSource._updateChangeSubscription();
    !withoutNotification && this.toastr.success('Запись успешно добавлена!');
  }

  edit(item: T, idField = 'id', withoutNotification?: boolean): void {
    const dataSource = this.dataSource;
    const index = dataSource.data.findIndex(
      (el) => el[idField] === item[idField],
    );

    dataSource.data[index] = item;
    dataSource._updateChangeSubscription();
    !withoutNotification && this.toastr.success('Запись успешно сохранена!');
  }

  remove(item: T, idField = 'id', withoutNotification?: boolean): void {
    const dataSource = this.dataSource;
    const index = dataSource.data.findIndex(
      (el) => el[idField] === item[idField],
    );

    dataSource.data.splice(index, 1);
    dataSource._updateChangeSubscription();
    !withoutNotification && this.toastr.success('Запись успешно удалена!');
  }

  export(fileName?: string) {
    const binding = this.dataBinding as EntityRemoteDataBinding<T>;
    const url = binding.urlRoot;
    const filter = this.lastFilter;
    fileName ??= 'отчет.xlsx';
    const subscription = this.http
      .get(url + `/export/excel${filter ? '?filter=' + this.lastFilter : ''}`, {
        responseType: 'blob',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((file: Blob) => {
        const url = window.URL.createObjectURL(file);
        const link = document.createElement('a');

        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }
}
