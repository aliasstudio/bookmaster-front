import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/auth/services/auth.service';
import { Token } from '@app/core/models/interfaces';

@Injectable()
export class BaseInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const requestUrl = 'https://demo.technocom.tech/pi-api/' + request.url;

    return next
      .handle(this.addAuthToken(request.clone({ url: requestUrl })))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorStatus =
            error instanceof HttpErrorResponse
              ? error.status || HttpStatusCode.NotFound
              : null;
          let message = null;

          switch (errorStatus) {
            case HttpStatusCode.NotFound: {
              message = `API по адресу <strong>${requestUrl.replace(
                /\/\d+/g,
                '/{ID}',
              )}</strong> недоступен или отсутствует`;
              break;
            }
            case HttpStatusCode.InternalServerError: {
              const errorMessage = error.error as HttpErrorResponse;
              message = `<strong>${requestUrl.replace(
                /\/\d+/g,
                '/{ID}',
              )}</strong><br>${errorMessage.status} ${errorMessage.error}<br>${
                errorMessage.message
              }`;
              break;
            }
            case HttpStatusCode.Forbidden: {
              const excludedRoutes = ['login', 'logout'];
              const messageForbidden = (
                (error?.error || JSON.parse(error?.error)) as HttpErrorResponse
              )?.message;

              if (!excludedRoutes.includes(request.url) && !!messageForbidden) {
                message = messageForbidden;
              }
              break;
            }
            case HttpStatusCode.Conflict: {
              const errorMessage = error.error as HttpErrorResponse;
              this.toastr.warning(errorMessage.message);
              break;
            }
            case HttpStatusCode.Unauthorized: {
              this.toastr.warning(`Сессия авторизации истекла`);
              this.authService.clearToken();
              break;
            }
          }

          message && this.toastr.warning(message, `Запрос не выполнен`);

          return throwError(() => error);
        }),
        tap(() => {
          const token = this.authService.getToken();
          const storeToken: Token = { token, date: new Date().toJSON() };

          localStorage.setItem('auth-token', JSON.stringify(storeToken));
        }),
      );
  }

  addAuthToken(request: HttpRequest<any>) {
    const token = this.authService.getToken();

    if (!token) {
      return request;
    }

    return request.clone({
      setHeaders: {
        'Auth-Token': token,
      },
    });
  }
}
