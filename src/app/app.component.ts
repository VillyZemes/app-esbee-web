import { Component, OnInit, afterNextRender } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from "./core/navbar/navbar.component";
import { FooterComponent } from "./core/footer/footer.component";
import { filter } from 'rxjs/operators';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { ToastNotificationComponent } from './shared/components/toast-notification/toast-notification.component';
import { UtilsService } from './shared/services/utils.service';

@Component({
  selector: 'sb-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, LoadingSpinnerComponent, ToastNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'app-esbee-web';

  constructor(
    private router: Router,
    private utilsService: UtilsService
  ) {
    // Initialize scroll to top functionality
    this.utilsService.initScrollToTopOnPageLoad();

    // Force scroll to top immediately after render
    afterNextRender(() => {
      this.utilsService.scrollToTop(false);
    });
  }

  ngOnInit() {
    // Subscribe to router events to detect navigation end
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Smooth scroll to top when navigation completes
      this.utilsService.scrollToTop(true);
    });
  }
}
