import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../shared/notification.services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        let authReq = req;
        if (token) {
          authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
          });
        }
        return next.handle(authReq);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notificationService.showError(
            'Unauthorized access. Please log in.'
          );
          this.authService.logout();
        } else if (error.status === 404) {
          this.notificationService.showError('Resource not found.');
        } else if (error.status === 500) {
          this.notificationService.showError(
            'Server error. Please try again later.'
          );
        } else {
          this.notificationService.showError('An unexpected error occurred.');
        }
        return throwError(() => error);
      })
    );
  }
}
