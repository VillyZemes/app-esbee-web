import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MessageModel } from '../models/MessageModel';
import { MessageService } from '../services/message.service';
//import { AuthService } from '../services/core/auth.service';


export const messageAndErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);
    //const authService = inject(AuthService);

    return next(req).pipe(
        tap((event) => {
            messageService.infoMessages$.next([]);
            messageService.warningMessages$.next([]);
            messageService.successMessages$.next([]);
            messageService.errorMessages$.next([]);

            if (event instanceof HttpResponse && event.body) {

                const body = event.body as { messages?: MessageModel[], data?: any };

                if (body.messages && Array.isArray(body.messages)) {
                    body.messages.forEach((msg) => {
                        switch (msg.type) {
                            case 'success':
                                messageService.showSuccess(msg);
                                break;
                            case 'error':
                                messageService.processError({ message: msg, errors: {} });
                                break;
                            case 'warning':
                                messageService.showWarning(msg);
                                break;
                            case 'info':
                                messageService.showInfo(msg);
                                break;
                        }
                    });

                    event = event.clone({ body: body.data ?? body });
                }
            }
        }),
        catchError((error: HttpErrorResponse) => {
            if (error.error instanceof ErrorEvent) {
                messageService.processError({ message: error.error.message, errors: {} });
            } else {
                switch (error.status) {
                    case 0:
                        console.error('ERRORS.BACKEND_NOT_RESPONDING');
                        messageService.showError('ERRORS.BACKEND_NOT_RESPONDING');
                        //authService.deleteAllCookiesAndNavigate();
                        break;
                    case 401:
                    case 403:
                        console.warn('ERRORS.UNAUTHORIZED_REDIRECTING');
                        messageService.showError('ERRORS.UNAUTHORIZED_REDIRECTING');
                        //authService.deleteAllCookiesAndNavigate();
                        break;
                    case 302:
                        console.warn('ERRORS.RECEIVED_REDIRECT_UNAUTHORIZED', {
                            url: error.url,
                            statusText: error.statusText,
                            headers: error.headers,
                            message: error.message,
                        });
                        messageService.showError('ERRORS.RECEIVED_REDIRECT_UNAUTHORIZED');
                        //authService.deleteAllCookiesAndNavigate();
                        break;
                    default:
                        messageService.processError(
                            error.error && typeof error.error === 'object'
                                ? error.error
                                : { message: 'ERRORS.UNEXPECTED_ERROR', errors: {} }
                        );
                }
            }

            return throwError(() => {
                //messageService.showError('ERRORS.SOMETHING_BAD_HAPPENED');
                new Error('ERRORS.SOMETHING_BAD_HAPPENED');
            });
        })
    );
};
