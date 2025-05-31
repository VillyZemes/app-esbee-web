import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProductImage } from '../../models/ProductImage.model';
import { environment } from '../../../environments/environment';
import { PricePipe } from '../../pipes/price.pipe';
import { ProductModel } from '../../models/Product.model';
import { CartItemWithDetails } from '../models/CartModel';
import { PriceTotals } from '../../pages/cart/cart-products/cart-products.component';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
  ) { }

  navigateTo(url: string): void {
    window.location.href = url;
  }

  navigateToHome(): void {
    this.navigateTo('/dashboard');
  }

  routerTo(url: string): void {
    location.href = url;
  }

  scrollToTop(smooth: boolean = true): void {
    // Multiple attempts to ensure scroll to top works in all scenarios
    window.scrollTo(0, 0);

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: smooth ? 'smooth' : 'instant'
      });
    }, 100);
  }

  initScrollToTopOnPageLoad(): void {
    // Disable browser scroll restoration
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Force immediate scroll to top
    this.scrollToTop(false);
  }

  smoothNavigateTo(elementId: string, offset: number = 0): void {
    // Add a small delay to ensure DOM is updated
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      } else {
        console.warn(`Element with ID '${elementId}' not found`);
        // Try again after a longer delay
        setTimeout(() => {
          const retryElement = document.getElementById(elementId);
          if (retryElement) {
            const elementPosition = retryElement.offsetTop - offset;
            window.scrollTo({
              top: elementPosition,
              behavior: 'smooth'
            });
          } else {
            console.error(`Element with ID '${elementId}' still not found after retry`);
          }
        }, 300);
      }
    }, 100);
  }

  /* username(user: User): string {
    if (!user) return '';
    return user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.name || user.email;
  } */

  /* usertype(user: User): string {
    if (!user) return 'N/A';
    return user.is_trainer ? 'Trainer' : 'Trainee';
  } */

  /* getDifficultyDisplay(difficultyId: number | undefined, short: boolean = false): string {
    if (!difficultyId) return 'N/A';
    const difficulty = WorkoutConstants.workoutDifficultyLevels.find(d => d.id === difficultyId);
    if (!difficulty) return 'N/A';
    return short ? difficulty.short : difficulty.display;
  } */

  convertToSelectOptions(data: any[], valueField: string, labelField: string): { id: number; display: string }[] {
    return data.map(workout => ({
      id: workout[valueField],
      display: workout[labelField]
    }));
  }

  formatDate(dateValue: Date): string {
    const formattedToday = `${dateValue.getFullYear()}-${String(dateValue.getMonth() + 1).padStart(2, '0')}-${String(dateValue.getDate()).padStart(2, '0')}`;
    return formattedToday;
  }

  calculateBMI(weight: number, height: number): number | null {
    if (!weight || !height) return null;

    // BMI = weight(kg) / (height(m))²
    const heightInMeters = height / 100;
    return +(weight / (heightInMeters * heightInMeters)).toFixed(1);
  }

  calculateAge(birthDate: string | Date): number | null {
    if (!birthDate) return null;

    // Convert string to Date object if needed
    let birthDateObj: Date;
    if (typeof birthDate === 'string') {
      birthDateObj = new Date(birthDate);

      // Check if valid date was created
      if (isNaN(birthDateObj.getTime())) {
        return null;
      }
    } else {
      birthDateObj = birthDate;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  }

  refreshPage(): void {
    window.location.reload();
  }

  getNotificationIcon(type: string | undefined): string {
    if (!type) return 'notifications';

    switch (type.toLowerCase()) {
      case 'workout': return 'fitness_center';
      case 'workout_recommendation': return 'recommend';
      case 'achievement': return 'emoji_events';
      case 'milestone': return 'military_tech';
      case 'system': return 'info';
      case 'warning': return 'warning';
      case 'message': return 'message';
      case 'welcome': return 'celebration';
      case 'reminder': return 'event_upcoming';
      case 'tip': return 'tips_and_updates';
      case 'summary': return 'summarize';
      case 'promotion': return 'local_offer';
      default: return 'notifications';
    }
  }

  getNotificationBg(type: string | undefined): string {
    if (!type) return 'cc-bg-notification';

    switch (type.toLowerCase()) {
      case 'workout': return 'cc-bg-orange';
      case 'workout_recommendation': return 'cc-bg-blue';
      case 'achievement': return 'cc-bg-gold';
      case 'milestone': return 'cc-bg-purple';
      case 'system': return 'cc-bg-teal';
      case 'warning': return 'cc-bg-orange';
      case 'message': return 'cc-bg-cyan';
      case 'welcome': return 'cc-bg-pink';
      case 'reminder': return 'cc-bg-amber';
      case 'tip': return 'cc-bg-cyan';
      case 'summary': return 'cc-bg-indigo';
      case 'promotion': return 'cc-bg-green';
      default: return 'cc-bg-notification';
    }
  }

  getNotificationTextColor(type: string | undefined): string {
    if (!type) return 'cc-text-notification';

    switch (type.toLowerCase()) {
      case 'workout': return 'cc-text-orange';
      case 'workout_recommendation': return 'cc-text-blue';
      case 'achievement': return 'cc-text-gold';
      case 'milestone': return 'cc-text-purple';
      case 'system': return 'cc-text-teal';
      case 'warning': return 'cc-text-orange';
      case 'message': return 'cc-text-cyan';
      case 'welcome': return 'cc-text-pink';
      case 'reminder': return 'cc-text-amber';
      case 'tip': return 'cc-text-cyan';
      case 'summary': return 'cc-text-indigo';
      case 'promotion': return 'cc-text-green';
      default: return 'cc-text-notification';
    }
  }

  /**
   * Formats seconds into a human-readable time format (HH:MM:SS or MM:SS)
   * @param seconds - The number of seconds to format
   * @param showZeroHours - Whether to show hours when they are zero (default: false)
   * @returns Formatted time string
   */
  formatSecondsToTime(seconds: number | null | undefined): string {
    if (seconds === null || seconds === undefined || isNaN(seconds)) {
      return '00:00';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format with leading zeros
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Only include hours in the output if there are any
    if (hours > 0) {
      const formattedHours = hours.toString().padStart(2, '0');
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  /**
   * Normalizes a string by removing diacritics
   * Converts characters like á, é, í, ó, ú to a, e, i, o, u
   */
  normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /* 
    * Filters an array of objects based on a string query and a specific field
    * Handles diacritics and partial matches
    * @param query - The search query
    * @param data - The array of objects to filter
    * @param field - The field in the object to search against
    * @returns Filtered array of objects that match the query
  */
  filterByString(query: string, data: any[], field: string): any[] {
    // Normalize the query to handle diacritics
    const normalizedQuery = this.normalizeString(query.toLowerCase().trim());

    data = data.filter(item => {
      if (!item[field]) return false;

      // Normalize the grocery name to handle diacritics
      const normalizedName = this.normalizeString(item[field].toLowerCase());

      // Check if normalized name contains normalized query
      return normalizedName.includes(normalizedQuery);
    });

    return data;
  }

  normalizeDashSeparatedString(str: string): string {
    if (!str) return str;
    return str.replace(/\s*-\s*/g, ' - ');
  }

  slugify(str: string): string {
    if (!str) return str;
    return str
      .toString()
      .normalize("NFKD")                     // Handle accents and diacritics
      .replace(/[\u0300-\u036f]/g, "")      // Remove diacritics
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")         // Remove invalid chars
      .replace(/\s+/g, "-")                 // Replace spaces with hyphens
      .replace(/-+/g, "-");                 // Collapse multiple hyphens
  }

  getDefaultImageSrc(images: ProductImage[]): string {
    if (!images || images.length === 0) {
      return 'assets/images/default-product-image.png'; // Default image path
    }

    // Find the primary image or the first image if no primary is set
    const primaryImage = images.find(image => image.is_primary);
    let imageSrc = primaryImage ? primaryImage.image_url || primaryImage.image_path : images[0].image_url || images[0].image_path;
    return imageSrc;
  }

  /* getRouteParam(arg0: string) {
    const url = this.router.url;
    const params = new URLSearchParams(url.split('?')[1]);
    return params.get(arg0);
  } */

  getShippingPrice(totalPrice: number, shippingPrice: number, freeShippingThreshold: number): number {
    if (totalPrice >= freeShippingThreshold) {
      return 0; // Free shipping
    }
    return shippingPrice; // Regular shipping price
  }



  getShippingPriceText(totalPrice: number, shippingPrice: number, freeShippingThreshold: number): string {
    const shippingPriceCalculated = this.getShippingPrice(totalPrice, shippingPrice, freeShippingThreshold);
    if (shippingPriceCalculated === 0) {
      return 'Doprava zdarma';
    }
    return PricePipe.formatPrice(shippingPrice);
  }

  getPrimaryImage(product: ProductModel): string {
    if (!product || !product.images) {
      return '';
    }
    const primaryImage = product.images.find(img => img.is_primary);
    return primaryImage?.image_path || product.images[0]?.image_path || '';
  }

  getColorDisplayName(color: string): string {
    return color === 'black' ? 'Čierna' : 'Biela';
  }

  calculateVat(price: number, vatRate: number): PriceTotals {
    if (!price) {
      return null;
    }

    const vatRateDecimal = (vatRate || 0) / 100;
    const withoutVat = price / (1 + vatRateDecimal);
    const vat = price - withoutVat;

    const result: PriceTotals = {
      price: price,
      withoutVat: withoutVat,
      vat: vat
    };
    return result;
  }



}
