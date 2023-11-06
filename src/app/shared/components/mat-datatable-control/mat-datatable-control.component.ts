import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, } from '@angular/core';
import { MatDatatableComponent } from '@app/shared/components/mat-datatable/mat-datatable.component';
import { PlainObject } from '@ngxs/store/internals';
import { DestroyService } from '@app/core/services/destroy.service';
import { MatDrawer } from '@angular/material/sidenav';
import { BehaviorSubject, catchError, first, map, of, takeUntil, tap, throwError, } from 'rxjs';
import * as _ from 'lodash';
import { CustomRequestOptions, EntityRemoteDataBinding, } from '@app/shared/models/databinding';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mat-datatable-control',
  templateUrl: './mat-datatable-control.component.html',
  styleUrls: ['./mat-datatable-control.component.scss'],
  providers: [DestroyService],
})
export class MatDatatableControlComponent<
  T extends PlainObject,
> extends MatDatatableComponent<T> {
  @ViewChild('drawer') drawer: MatDrawer;

  @Input() formRef: TemplateRef<any>;
  @Input() readOnly: boolean;
  @Input() formTitle: string;

  @Output() removed = new EventEmitter<T>();

  selectedItem$ = new BehaviorSubject<T>(null);

  protected onBindingComplete() {
    super.onBindingComplete();

    // Добавляем колонку для редактирования, если не readOnly
    !this.readOnly && this.columnKeys.push('control');
  }

  open(item?: T): void {
    of(item)
      .pipe(map((entity: T) => this.selectedItem$.next(entity)))
      .subscribe(() => this.drawer.open());
  }

  delete(item: T, customOptions?: CustomRequestOptions): void {
    const { idField, req$, url, withoutNotification } = {
      ...customOptions,
      idField: customOptions?.idField || this.dataBinding?.idField || 'id',
    };

    // Если не передан запрос, сразу обновляем данные в гриде, иначе обновляем только после запроса
    if (_.has(this.dataBinding, 'urlRoot') || req$ || url) {
      const binding = this.dataBinding as EntityRemoteDataBinding<T>;
      const reqUrl = url || `${binding.urlRoot}/${item[idField]}`;
      const deleteReq$ = req$ ?? this.http.delete(reqUrl);

      deleteReq$
        .pipe(
          first(),
          catchError((error: HttpErrorResponse) => {
            error?.error &&
              !withoutNotification &&
              this.toastr.error('Ошибка удаления записи!');
            return throwError(() => error);
          }),
          tap(() => this.remove(item, idField, withoutNotification)),
          takeUntil(this.destroy$),
        )
        .subscribe(() => this.removed.emit(item));
    } else {
      this.remove(item, idField, withoutNotification);
      this.removed.emit(item);
    }
  }

  create(item: T, customOptions?: CustomRequestOptions): void {
    const { req$, url, withoutNotification } = customOptions || {};

    // TODO: Если с бэка будет прилетать модель, как результат - обновлять моделью с сервера
    if (_.has(this.dataBinding, 'urlRoot') || req$ || url) {
      const binding = this.dataBinding as EntityRemoteDataBinding<T>;
      const reqUrl = url || binding.urlRoot;
      const postReq$ = req$ ?? this.http.post(reqUrl, item);

      postReq$
        .pipe(
          first(),
          catchError((error: HttpErrorResponse) => {
            error?.error &&
              !withoutNotification &&
              this.toastr.error('Ошибка добавления записи!');
            return throwError(() => error);
          }),
          tap(() => {
            this.add(item, withoutNotification);
            this.selectedItem$.next(item);
          }),
          takeUntil(this.destroy$),
        )
        .subscribe();
    } else {
      this.add(item, withoutNotification);
    }
  }

  update(item: T, customOptions?: CustomRequestOptions): void {
    const { idField, req$, url, withoutNotification } = {
      ...customOptions,
      idField: customOptions?.idField || this.dataBinding?.idField || 'id',
    };

    // TODO: Если с бэка будет прилетать модель, как результат - обновлять моделью с сервера
    if (_.has(this.dataBinding, 'urlRoot') || req$ || url) {
      const binding = this.dataBinding as EntityRemoteDataBinding<T>;
      const reqUrl = url || `${binding.urlRoot}/${item[idField]}`;
      const putReq$ = req$ ?? this.http.put(reqUrl, item);

      putReq$
        .pipe(
          first(),
          catchError((error: HttpErrorResponse) => {
            error?.error &&
              !withoutNotification &&
              this.toastr.error('Ошибка сохранения записи!');
            return throwError(() => error);
          }),
          tap(() => {
            this.edit(item, idField, withoutNotification);
            this.selectedItem$.next(item);
          }),
          takeUntil(this.destroy$),
        )
        .subscribe();
    } else {
      this.edit(item, idField, withoutNotification);
    }
  }

  save(item: T, customOptions?: CustomRequestOptions): void {
    const idField = customOptions?.idField || this.dataBinding?.idField || 'id';
    const isEntityNew = !_.get(this.selectedItem$.getValue(), idField);

    isEntityNew
      ? this.create(item, customOptions)
      : this.update(item, customOptions);
  }
}
