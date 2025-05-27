import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { LoadingService } from './loading.service';
import { environment } from '../../../environments/environment';
import { CONSTANTS_API } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class HttpCoreService {

  apiUrl: string = environment.apiUrl + '/api';
  // Use a static counter to share across all instances 
  // (we don't actually need this anymore since LoadingService now handles counting)
  private requestId = 0;

  constructor(
    protected http: HttpClient,
    protected loadingService: LoadingService,
  ) { }

  private startLoading(loading: boolean): number {
    if (loading) {
      const currentRequestId = ++this.requestId;
      this.loadingService.showLoading();
      return currentRequestId;
    }
    return 0;
  }

  private endLoading(loading: boolean, requestId: number): void {
    if (loading) {
      this.loadingService.hideLoading();
    }
  }

  protected callWebServiceNoLoading<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
  ): Observable<T> {
    return this.callWebService<T>(method, endpoint, data, undefined, false)
  }

  protected callWebService<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    options?: {
      headers?: HttpHeaders,
      params?: HttpParams,
      withCredentials?: boolean,
      tapMessage?: string
    },
    loading: boolean = true
  ): Observable<T> {
    const requestId = this.startLoading(loading);
    const url = `${this.apiUrl}/${endpoint}`;

    const headers = options?.headers ?? CONSTANTS_API.HEADERS;
    const withCredentials = options?.withCredentials ?? true;

    const httpOptions = {
      headers,
      params: options?.params,
      withCredentials
    };

    let request$: Observable<T>;

    switch (method) {
      case 'GET':
        request$ = this.http.get<T>(url, httpOptions);
        break;
      case 'POST':
        request$ = this.http.post<T>(url, data, httpOptions);
        break;
      case 'PUT':
        request$ = this.http.put<T>(url, data, httpOptions);
        break;
      case 'DELETE':
        request$ = this.http.delete<T>(url, httpOptions);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return request$.pipe(
      tap(() => {
        console.log(`${options?.tapMessage || ('Request successful: ' + method + ' ' + url)}`);
      }),
      catchError((error) => {
        console.error(`HTTP request failed [${requestId}]:`, error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.endLoading(loading, requestId);
      })
    );
  }

  protected callWebServiceFormData<T>(
    endpoint: string,
    formData?: any,
    loading: boolean = true
  ): Observable<T> {
    const requestId = this.startLoading(loading);
    const url = `${this.apiUrl}/${endpoint}`;

    return this.http.post<T>(url, formData, {
      withCredentials: true
    }).pipe(
      tap(() => {
        console.log(`Request FormData successful: ${url} [${requestId}]`);
      }),
      catchError((error) => {
        console.error(`HTTP request failed [${requestId}]:`, error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.endLoading(loading, requestId);
      })
    );
  }
}
