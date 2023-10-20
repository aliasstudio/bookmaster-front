import { PlainObject } from '@ngxs/store/internals';

export interface Page<T extends PlainObject> {
  content: T[];
}
