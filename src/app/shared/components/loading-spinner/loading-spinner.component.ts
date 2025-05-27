import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'cc-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  percent: number | null = null; // Initialize percent to null
  private subscription: Subscription | null = null;

  constructor(
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscription = this.loadingService.loading$.subscribe(value => {
      this.isLoading = value;
      this.cdr.detectChanges(); // Explicitly trigger change detection
    });
    this.loadingService.percent$.subscribe(percent => {
      if (percent !== null) {
        this.percent = percent; // Show loading spinner when percent is not null
        if (percent >= 100) {
          this.loadingService.percent$.next(null); // Reset percent to null when loading is complete
          this.percent = null; // Hide loading spinner when percent is 100
        }
      }
    });
  }


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
