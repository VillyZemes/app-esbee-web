/* import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

function getXsrfTokenFromCookie(): string | null {
  const cookieName = 'XSRF-TOKEN=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length);
    }
  }
  return null;
}

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const xsrfToken = getXsrfTokenFromCookie();

  const modifiedReq = xsrfToken
    ? req.clone({
      setHeaders: { 'X-XSRF-TOKEN': xsrfToken },
      withCredentials: true,
    })
    : req;

  return next(modifiedReq);
};
 */