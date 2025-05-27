import { Component, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { IconFontAwesomeService } from '../../shared/services/icon-font-awesome.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { PricePipe } from '../../pipes/price.pipe';

@Component({
  selector: 'sb-navbar',
  imports: [CommonModule, FontAwesomeModule, RouterLink, RouterModule, RouterLinkActive, PricePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit, OnInit {
  isMobileMenuOpen = false;
  isNavbarHidden = false;
  private lastScrollTop = 0;
  private scrollThreshold = 100; // Minimum scroll amount before showing/hiding
  freeShippingThreshold: number = null;

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
    private settingsService: SettingsService,
  ) {
    this.cartItemsCount$ = new Observable(observer => {
      this.cartService.cart$.subscribe(cartItems => {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        observer.next(count);
      });
    });

    this.settingsService.fetchSettings().subscribe(settings => {
      this.freeShippingThreshold = settings?.free_shipping_threshold;
    });
  }

  ngOnInit(): void {
    // Initialize scroll position
    this.lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
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
}
