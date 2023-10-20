import { PlainObject } from '@ngxs/store/internals';
import { FormControl } from '@angular/forms';

export type FormControlMap<T extends PlainObject> = {
  [key in keyof T]: FormControl;
};
