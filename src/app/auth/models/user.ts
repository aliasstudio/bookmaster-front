import { Registry, RegistryPrivilege } from '@app/auth/models/privilege';

export interface User {
  firstName: string;
  lastName: string;
  secondName: string; // FIXME: переименовать на бэке на middleName
  allRegistry: Record<Registry, RegistryPrivilege[]>;
}
