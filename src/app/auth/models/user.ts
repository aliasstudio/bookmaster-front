import { Registry, RegistryPrivilege } from '@app/auth/models/privilege';
import { Role } from '@app/auth/models/roles';

export interface User {
  firstName: string;
  lastName: string;
  secondName: string; // FIXME: переименовать на бэке на middleName
  roles: Role[];
  allRegistry: Record<Registry, RegistryPrivilege[]>;
}
