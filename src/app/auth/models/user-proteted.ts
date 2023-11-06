import { User } from '@app/auth/models/user';

export interface UserProtected extends User {
  login: string;
  password: string;
}
