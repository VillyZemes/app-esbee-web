/* import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Router } from '@angular/router';

export const httpInterceptorWithMessageHandling: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);
  console.log('event');
  return next(req).pipe(
    tap((event) => {
      console.log(event);
      if (event instanceof HttpResponse) {
        // Log the response if the status code is 302
        
        if (event.status === 302) {
          console.warn('Received 302 redirect response:', event);
        }

        if (event.body) {
          const body: any = event.body;

          // Check if response contains messages
          if (body.messages) {
            const messages = body.messages;

            // Process each message based on its type
            messages.forEach((msg: { type: string; message: string }) => {
              switch (msg.type) {
                case 'success':
                  messageService.showSuccess(msg.message);
                  break;
                case 'error':
                  messageService.processError({ message: msg.message, errors: {} });
                  break;
                case 'warning':
                  console.warn(msg.message); // You can add a warning handling method if needed
                  break;
                case 'info':
                  console.info(msg.message); // You can add an info handling method if needed
                  break;
              }
            });

            // Modify response to remove messages before passing it along
            event = event.clone({ body: body.data ?? body });
          }
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        console.error('A client-side or network error occurred:', error.error.message);
        messageService.processError({ message: error.error.message, errors: {} });
      } else {
        console.error(`Backend returned code ${error.status}, body was:`, error.error);

        if (error.status === 0) {
          console.error('Backend is not responding');
          router.navigate(['/sign-in']);
        } else if ([401, 403].includes(error.status)) {
          console.warn('Unauthorized or forbidden request. Redirecting to login...');
          router.navigate(['/sign-in']);
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