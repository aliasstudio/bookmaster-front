import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/auth/services/auth.service';

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
    const requestUrl = 'http://localhost:777/pi-api/' + request.url;

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
              const errorMessage = JSON.parse(error.error) as HttpErrorResponse;
              message = `<strong>${requestUrl.replace(
                /\/\d+/g,
                '/{ID}',
              )}</strong><br>${errorMessage.status} ${errorMessage.error}<br>${
                errorMessage.message
              }`;
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
      );
  }

  addAuthToken(request: HttpRequest<any>) {
    const token = this.authService.getToken();

    if (!token) {
      return request;
    }

    return request.clone({
      setHeaders: {
        'Auth-Token': this.authService.getToken(),
      },
    });
  }
}
