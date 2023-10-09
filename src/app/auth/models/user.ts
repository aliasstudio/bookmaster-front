import { Dictionary } from '@app/core/models/dictionary';

export interface User {
  firstName: string;
  lastName: string;
  middleName: string;
  role?: Dictionary<number>;
}
