import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
export class MatDatatableComponent<T extends PlainObject> implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input({ required: true }) dataBinding: DataBinding<T>;

  dataSource = new MatTableDataSource<T>();

  protected columns: Column<T>[];
  protected columnKeys: string[];

  constructor(
    protected destroy$: DestroyService,
    protected http: HttpClient,
    protected toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const dataBinding = this.dataBinding;

    this.columns = dataBinding.columns;
    this.bindData();
  }

  bindData(): void {
    const dataBinding = this.dataBinding;

    if (_.has(dataBinding, 'loadReq$')) {
      const binding = dataBinding as RemoteDataBinding<T>;

      binding.loadReq$
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ content }) => this.setData(content));
    } else if (_.has(dataBinding, 'urlRoot')) {
      const binding = dataBinding as EntityRemoteDataBinding<T>;
      const url = binding.urlRoot;

      this.http
        .get<Page<T>>(url)
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ content }) => this.setData(content));
    } else {
      const binding = dataBinding as LocalDataBinding<T>;

      this.setData(binding.data);
    }
  }

  private setData(data: T[]): void {
    this.dataSource.data = data;
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
    this.columnKeys = (this.columns || columns).map((col) => col.key);

    dataSource.paginator = this.paginator;
    dataSource.sort = this.sort;
    dataSource._updateChangeSubscription();
  }

  add(item: T, withoutNotification?: boolean): void {
    const dataSource = this.dataSource;

    dataSource.data.unshift(item);
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
}
