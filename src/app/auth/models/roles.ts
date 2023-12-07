import { Dictionary } from '@app/core/models/dictionary';

export interface Role extends Dictionary<number> {}

export enum RoleEnum {
  Admin,
  StandOperator,
  BookOperator,
  Manager,
}
export const Roles: Role[] = [
  {
    id: 1,
    name: 'Админ',
  },
  {
    id: 2,
    name: 'Оператор стойки',
  },
  {
    id: 3,
    name: 'Оператор книгооборота',
  },
  {
    id: 4,
    name: 'Управляющий',
  },
];
