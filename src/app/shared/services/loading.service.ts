import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  percent$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private loadingCount = 0;

  constructor() { }

  showLoading() {
    this.loadingCount++;
    this.loading$.next(true);
  }

  hideLoading() {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }

    // Only hide the loading indicator if all requests are complete
    if (this.loadingCount === 0) {
      this.loading$.next(false);
    }
  }

  isLoading(): boolean {
    return this.loading$.getValue();
  }

  // Debug method to reset state if needed
  resetLoading() {
    this.loadingCount = 0;
    this.loading$.next(false);
  }
}
