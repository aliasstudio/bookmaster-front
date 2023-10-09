import { User } from '@app/auth/models/user';

// Используется для регистрации
export interface UserProtected extends User {
  login: string;
  password: string;
}
