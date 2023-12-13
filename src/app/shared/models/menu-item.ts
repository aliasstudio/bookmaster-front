import { Identifiable } from '@app/core/models/identifable';
import { Function } from '@app/core/models/interfaces';
import { Registry, RegistryPrivilege } from '@app/auth/models/privilege';

export interface MenuItem extends Identifiable<string> {
  name: string;
  icon: string;
  link?: string;
  hidden?: Function<Record<Registry, RegistryPrivilege[]>, boolean>;
}
