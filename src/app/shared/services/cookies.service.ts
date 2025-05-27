import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: any
  ) { }

  public setCookie(name: string, value: string, expirationDays: number = 7): void {
    if (isPlatformBrowser(this.platformId)) {
      const date = new Date();
      date.setDate(date.getDate() + expirationDays);
      const expires = `expires=${date.toUTCString()}`;
      this.document.cookie = `${name}=${value}; ${expires}; path=/`;
    }
  }

  public getCookie(name: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const nameEQ = name + "=";
      const ca = this.document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length); // Trim leading whitespace
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }
  

  public deleteCookie(name: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setCookie(name, '', -1);
    }
  }

  public deleteAllCookies(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cookies = this.document.cookie.split(';');
      for (let cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        this.document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
    }
  }
  
}
