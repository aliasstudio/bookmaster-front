import { Dictionary } from '@app/core/models/dictionary';

export interface User {
  firstName: string;
  lastName: string;
  secondName: string; // FIXME: переименовать на бэке на middleName
  role?: Dictionary<number>;
}
