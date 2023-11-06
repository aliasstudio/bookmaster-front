import { PlainObject } from '@ngxs/store/internals';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

export type FormControlMap<T extends PlainObject> = {
  [key in keyof T]?: AbstractControl;
};

export type Function<TArgument = any, TResult = void> = (
  value: TArgument,
) => TResult;

export type ValueOrObservable<T = any> = T | Observable<T>;
