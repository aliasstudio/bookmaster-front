import { PlainObject } from '@ngxs/store/internals';
import { Column } from '@app/shared/models/column';
import { Observable } from 'rxjs';
import { Page } from '@app/shared/models/page';

export interface ColumnBinding<T extends PlainObject> {
  columns: Column<T>[];
  idField?: string;
}

export interface LocalDataBinding<T extends PlainObject>
  extends ColumnBinding<T> {
  data: T[];
}

export interface RemoteDataBinding<T extends PlainObject>
  extends ColumnBinding<T> {
  loadReq$: Observable<Page<T>>;
}

export interface EntityRemoteDataBinding<T extends PlainObject>
  extends ColumnBinding<T> {
  urlRoot: string;
}

export interface CustomRequestOptions {
  idField?: string;
  url?: string;
  req$?: Observable<unknown>;
  withoutNotification?: boolean;
}

export type DataBinding<T> =
  | LocalDataBinding<T>
  | RemoteDataBinding<T>
  | EntityRemoteDataBinding<T>;
