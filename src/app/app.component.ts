import { Component, OnInit, afterNextRender } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from "./core/footer/footer.component";
import { NavbarComponent } from "./core/navbar/navbar.component";
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { ToastNotificationComponent } from './shared/components/toast-notification/toast-notification.component';
import { PromoModalComponent } from './shared/components/promo-modal/promo-modal.component';
import { RecordsDataService } from './shared/services/records-data.service';
import { UtilsService } from './shared/services/utils.service';
import { PromoCodeModel } from './models/PromoCode.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sb-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, LoadingSpinnerComponent, ToastNotificationComponent, PromoModalComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'app-esbee-web';
  freeShippingThreshold: number;

  constructor(
    private router: Router,
    private utilsService: UtilsService,
    private recordsDataService: RecordsDataService,
  ) {
    this.utilsService.initScrollToTopOnPageLoad();
    afterNextRender(() => {
      this.utilsService.scrollToTop(false);
    });
  }

  ngOnInit() {
    // Subscribe to router events to detect navigation end
    this.routerEvents();
    this.fetchInitialData();
  }

  private routerEvents() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.utilsService.scrollToTop(true);
    });
  }

  private fetchInitialData() {
    this.recordsDataService.fetchRecordsData().subscribe((data) => {
      this.recordsDataService.recordsData$.next(data);
    });
  }
  
}
