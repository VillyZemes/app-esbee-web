import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartModel } from '../shared/models/CartModel';
import { CookiesService } from '../shared/services/cookies.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_COOKIE_NAME = 'esbee_cart';
  private cartItems: CartModel[] = [];
  private cartSubject = new BehaviorSubject<CartModel[]>([]);

  constructor(private cookiesService: CookiesService) {
    this.loadCartFromCookies();
  }

  get cart$(): Observable<CartModel[]> {
    return this.cartSubject.asObservable();
  }

  get cartItems$(): CartModel[] {
    return this.cartItems;
  }

  addToCart(item: CartModel): void {
    const existingItemIndex = this.cartItems.findIndex(
      cartItem => cartItem.product_id === item.product_id &&
        cartItem.product_variant_id === item.product_variant_id
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      this.cartItems[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item to cart
      this.cartItems.push(item);
    }

    this.saveCartToCookies();
    this.cartSubject.next([...this.cartItems]);
  }

  removeFromCart(productId: number, variantId?: number): void {
    this.cartItems = this.cartItems.filter(
      item => !(item.product_id === productId && item.product_variant_id === variantId)
    );

    this.saveCartToCookies();
    this.cartSubject.next([...this.cartItems]);
  }

  updateQuantity(productId: number, quantity: number, variantId?: number): void {
    const itemIndex = this.cartItems.findIndex(
      item => item.product_id === productId && item.product_variant_id === variantId
    );

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        this.removeFromCart(productId, variantId);
      } else {
        this.cartItems[itemIndex].quantity = quantity;
        this.saveCartToCookies();
        this.cartSubject.next([...this.cartItems]);
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.cookiesService.deleteCookie(this.CART_COOKIE_NAME);
    this.cartSubject.next([]);
  }

  getCartItemsCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  private loadCartFromCookies(): void {
    const cartData = this.cookiesService.getCookie(this.CART_COOKIE_NAME);
    if (cartData) {
      try {
        this.cartItems = JSON.parse(cartData);
        this.cartSubject.next([...this.cartItems]);
      } catch (error) {
        console.error('Error parsing cart data from cookies:', error);
        this.cartItems = [];
      }
    }
  }

  private saveCartToCookies(): void {
    this.cookiesService.setCookie(this.CART_COOKIE_NAME, JSON.stringify(this.cartItems), 30);
  }
}
