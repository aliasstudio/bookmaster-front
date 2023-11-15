import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  first,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserProtected } from '@app/auth/models/user-proteted';
import { Router } from '@angular/router';
import { parseJSON } from 'date-fns';

interface Token {
  token: string;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly isAuthorized$ = new BehaviorSubject<boolean>(
    !!this.getToken(),
  );

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
  ) {}

  getTokenDate(): Date | undefined {
    const tokenRef = JSON.parse(localStorage.getItem('auth-token')) as Token;

    return tokenRef?.date ? parseJSON(tokenRef.date) : undefined;
  }

  getToken(): string | undefined {
    const tokenRef = JSON.parse(localStorage.getItem('auth-token')) as Token;

    return tokenRef?.token;
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
          const storeToken: Token = { token, date: new Date().toJSON() };

          localStorage.setItem('auth-token', JSON.stringify(storeToken));
          this.isAuthorized$.next(!!this.getToken());
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

  logout(message = 'Вы успешно вышли из системы!'): Observable<unknown> {
    return this.http
      .get('logout', { params: { userCode: this.getToken() } })
      .pipe(
        first(),
        tap(() => {
          localStorage.removeItem('auth-token');
          this.isAuthorized$.next(!!this.getToken());
          this.router.navigate(['/auth']);
          this.toastr.success(message);
        }),
      );
  }

  clearToken(): void {
    localStorage.removeItem('auth-token');
    this.router.navigate(['/auth']);
  }
}
