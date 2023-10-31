import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, EMPTY, first, Observable, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserProtected } from '@app/auth/models/user-proteted';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  get isAuthorized(): boolean {
    return !!this.getToken();
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
  ) {}

  getToken(): string | undefined {
    return localStorage.getItem('auth-token');
  }

  login(login: string, password: string): Observable<unknown> {
    return this.http
      .post(
        'login',
        {
          login,
          password,
        },
        {
          responseType: 'text',
        },
      )
      .pipe(
        first(),
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.Forbidden) {
            this.toastr.error('Введен неверный логин или пароль');

            return EMPTY;
          }

          return throwError(() => error);
        }),
        tap((token: string) => {
          localStorage.setItem('auth-token', token);
          this.toastr.success('Вы успешно авторизованы!');
        }),
      );
  }

  register(user: UserProtected): Observable<unknown> {
    return this.http.post('user/registration', { ...user }).pipe(
      first(),
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          this.toastr.error('Пользователь с таким логином уже существует');

          return EMPTY;
        }

        return throwError(() => error);
      }),
      tap(() => {
        this.toastr.success('Пользователь успешно зарегистрирован в системе!');
      }),
    );
  }

  logout(): Observable<unknown> {
    return this.http
      .get('logout', { params: { userCode: this.getToken() } })
      .pipe(
        first(),
        tap(() => {
          localStorage.removeItem('auth-token');
          this.router.navigate(['/auth']);
          this.toastr.success('Вы успешно вышли из системы!');
        }),
      );
  }

  clearToken(): void {
    localStorage.removeItem('auth-token');
    this.router.navigate(['/auth']);
  }
}
