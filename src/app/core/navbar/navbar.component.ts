import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { COMPANY_CONSTANTS } from '../../constants/Company.constants';
import { PromoCodeModel } from '../../models/PromoCode.model';
import { PricePipe } from '../../pipes/price.pipe';
import { CartService } from '../../services/cart.service';
import { IconFontAwesomeService } from '../../shared/services/icon-font-awesome.service';
import { RecordsDataService } from '../../shared/services/records-data.service';

@Component({
  selector: 'sb-navbar',
  imports: [CommonModule, FontAwesomeModule, PricePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit, OnInit {
  companyInfo = COMPANY_CONSTANTS;
  isMobileMenuOpen = false;
  isNavbarHidden = false;
  private lastScrollTop = 0;
  private scrollThreshold = 100;
  freeShippingThreshold: number = null;
  promoCode: PromoCodeModel = null;
  currentRoute: string = '';

  navlinks: { name: string, link: string }[] = [
    { name: 'Domov', link: '/domov' },
    { name: 'O nás', link: '/o-nas' },
    { name: 'Obchod', link: '/obchod' },
    { name: 'Kontakt', link: '/kontakt' },
  ];

  cartItemsCount$: Observable<number>;

  constructor(
    public iconService: IconFontAwesomeService,
    private cartService: CartService,
    private recordsDataService: RecordsDataService,
    private router: Router,
  ) {
    this.cartItemsCount$ = new Observable(observer => {
      this.cartService.cart$.subscribe(cartItems => {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        observer.next(count);
      });
    });
  }

  ngOnInit(): void {
    this.recordsDataService.recordsData$.subscribe((data) => {
      this.freeShippingThreshold = data.settings.shipping_free_threshold;
      this.promoCode = data.promoCodeFeatured;
    });
    // Initialize scroll position
    this.lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
    });

    // Set initial route
    this.currentRoute = this.router.url;
  }

  ngAfterViewInit() {
    // Find the navbar toggler button
    const toggler = document.querySelector('.navbar-toggler') as HTMLElement;
    const navbarCollapse = document.getElementById('mobileMenu');

    if (toggler && navbarCollapse) {
      // Override the default Bootstrap behavior
      toggler.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Toggle the collapse immediately without animation
        if (navbarCollapse.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
          navbarCollapse.style.display = 'none';
        } else {
          navbarCollapse.classList.add('show');
          navbarCollapse.style.display = 'block';
        }
      });
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    // Make sure they scroll more than threshold
    if (Math.abs(this.lastScrollTop - st) <= this.scrollThreshold) return;

    // Determine scroll direction and position
    // Hide navbar when scrolling down and beyond initial position (>100px)
    if (st > this.lastScrollTop && st > 100) {
      this.isNavbarHidden = true;
      this.isMobileMenuOpen = false; // Close mobile menu when hiding navbar
    } else {
      // Show navbar when scrolling up or at the top
      this.isNavbarHidden = false;
    }

    this.lastScrollTop = st;
  }

  isLinkActive(link: string): boolean {
    // Remove leading slash if present for comparison
    const normalizedLink = link.startsWith('/') ? link.slice(1) : link;
    const normalizedRoute = this.currentRoute.startsWith('/') ? this.currentRoute.slice(1) : this.currentRoute;

    // Handle home/domov route
    if (normalizedLink === 'domov' || normalizedLink === '') {
      return normalizedRoute === '' || normalizedRoute === 'domov';
    }

    // For other routes, check if current route starts with the link
    return normalizedRoute.startsWith(normalizedLink);
  }
}
