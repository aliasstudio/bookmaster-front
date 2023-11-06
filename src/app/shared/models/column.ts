import { PlainObject } from '@ngxs/store/internals';

export interface Column<T extends PlainObject> {
  name?: string;
  key: Extract<keyof T, string>;
  customTemplate?: boolean;
}
