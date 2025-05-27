/* import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const authService = inject(AuthService);

  return next(req).pipe(
    tap((event) => {
      
      if (event instanceof HttpResponse) {
        
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Handle errors normally as per previous code
      if (error.error instanceof ErrorEvent) {
        console.error('A client-side or network error occurred:', error.error.message);
        messageService.processError({ message: error.error.message, errors: {} });
      } else {
        console.error(`Backend returned code ${error.status}, body was:`, error.error);

        if (error.status === 0) {
          console.error('Backend is not responding');
          authService.deleteAllCookiesAndNavigate();
        } else if (error.status === 401) {
          console.warn('Unauthorized request. Logging out...');
          authService.deleteAllCookiesAndNavigate();
        } else if (error.status === 302) {
          console.warn('Received 302 redirect. Handling as unauthorized access...');
          messageService.processError({
            message: 'Session expired or unauthorized access. Redirecting to login.',
            errors: {}
          });
          authService.deleteAllCookiesAndNavigate();
        } else {
          if (error.error && typeof error.error === 'object') {
            messageService.processError(error.error);
          } else {
            messageService.processError({
              message: 'An unexpected error occurred.',
              errors: {}
            });
          }
        }
      }

      return throwError(() => new Error(error.message || 'Something bad happened; please try again later.'));
    })
  );
};
 */