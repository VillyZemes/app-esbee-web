import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Product } from '../../../models/Product.model';
import { PricePipe } from '../../../pipes/price.pipe';
import { CartService } from '../../../services/cart.service';
import { ProductsService } from '../../../services/products.service';
import { SettingsService } from '../../../services/settings.service';
import { CartItemWithDetails, CartModel } from '../../../shared/models/CartModel';
import { MessageService } from '../../../shared/services/message.service';
import { UtilsService } from '../../../shared/services/utils.service';
import { SettingsModel } from '../../../shared/models/SettingsModel';
import { BannerFreeShippingComponent } from "../../../shared/components/banner-free-shipping/banner-free-shipping.component";



export interface PriceTotals {
  price: number;
  withoutVat: number;
  vat: number;
  //productsCount?: number;
}

@Component({
  selector: 'sb-cart-products',
  imports: [CommonModule, PricePipe, BannerFreeShippingComponent],
  templateUrl: './cart-products.component.html',
  styleUrl: './cart-products.component.scss'
})
export class CartProductsComponent {
  @Input() settings: SettingsModel;
  @Output() cartTotalsChanged = new EventEmitter<PriceTotals>();
  @Output() cartItemWithDetailsCompleted = new EventEmitter<CartItemWithDetails[]>();

  cartItems: CartItemWithDetails[] = [];
  isLoading = true;

  cartTotals: PriceTotals = {
    price: 0,
    withoutVat: 0,
    vat: 0,
  };

  constructor(
    private cartService: CartService,
    private productsService: ProductsService,
    private messageService: MessageService,
    public utilsService: UtilsService,
    public settingsService: SettingsService,
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  private loadCartItems(): void {
    this.cartService.cart$.subscribe(cartItems => {
      if (cartItems.length === 0) {
        this.cartItems = [];
        this.cartTotals = {
          price: 0,
          withoutVat: 0,
          vat: 0,
        };
        this.cartTotalsChanged.emit(this.cartTotals);
        this.isLoading = false;
        return;
      }

      // Only fetch products that we don't already have
      const missingProductIds = cartItems
        .filter(item => !this.cartItems.find(existing => existing.product_id === item.product_id))
        .map(item => item.product_id);

      if (missingProductIds.length === 0) {
        // We already have all the product data, just update the cart items
        this.updateCartItemsFromCache(cartItems);
        return;
      }

      const productRequests = missingProductIds.map(productId =>
        this.productsService.getProduct(productId.toString())
      );

      const allRequests = [
        ...productRequests
      ];

      forkJoin(allRequests).subscribe(results => {
        // All results are products since we're not fetching settings
        const products = results as Product[];

        // Create a product cache map
        const productCache = new Map();
        products.forEach(product => productCache.set(product.id, product));

        // Add existing products to cache
        this.cartItems.forEach(item => {
          if (item.product) {
            productCache.set(item.product.id, item.product);
          }
        });

        this.cartItems = cartItems.map(item => {
          const product = productCache.get(item.product_id);
          const variant = product?.variants?.find(v => v.id === item.product_variant_id);
          const basePrice = parseFloat(product?.price || '0');
          const adjustment = variant ? parseFloat(variant.price_adjustment) : 0;
          const totalPrice = (basePrice + adjustment) * item.quantity;

          return {
            ...item,
            product,
            variant,
            totalPrice
          };
        });

        this.calculateTotal();
        this.cartItemWithDetailsCompleted.emit(this.cartItems);
        this.isLoading = false;
      });
    });
  }

  openProduct(product: Product): void {
    this.utilsService.navigateTo(`/produkt/${product.slug}`);
  }

  private updateCartItemsFromCache(cartItems: CartModel[]): void {
    this.cartItems = cartItems.map(item => {
      const existingItem = this.cartItems.find(existing =>
        existing.product_id === item.product_id &&
        existing.product_variant_id === item.product_variant_id
      );

      if (existingItem && existingItem.product) {
        const product = existingItem.product;
        const variant = existingItem.variant;
        const basePrice = parseFloat(product.price);
        const adjustment = variant ? parseFloat(variant.price_adjustment) : 0;
        const totalPrice = (basePrice + adjustment) * item.quantity;

        return {
          ...item,
          product,
          variant,
          totalPrice
        };
      }

      return item as CartItemWithDetails;
    }).filter(item => (item as CartItemWithDetails).product); // Only keep items that have product data

    this.calculateTotal();
    this.cartItemWithDetailsCompleted.emit(this.cartItems);
  }

  private calculateTotal(): void {
    this.cartTotals.price = this.cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0);

    this.cartTotals.vat = this.cartItems.reduce((total, item) => {
      const totalPrice = item.totalPrice || 0;
      const vatRate = (item.product?.vat || 0) / 100;
      const priceWithoutVat = totalPrice / (1 + vatRate);
      const vatAmount = totalPrice - priceWithoutVat;
      return total + vatAmount;
    }, 0);

    this.cartTotals.withoutVat = this.cartTotals.price - this.cartTotals.vat;

    this.cartTotalsChanged.emit(this.cartTotals);
  }

  updateQuantity(item: CartItemWithDetails, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(item);
    } else {
      this.cartService.updateQuantity(item.product_id, quantity, item.product_variant_id);
    }
  }

  removeItem(item: CartItemWithDetails): void {
    this.cartService.removeFromCart(item.product_id, item.product_variant_id);
    this.messageService.showSuccess(`${item.product?.name} bol odstránený z košíka`);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.messageService.showSuccess('Košík bol vyprázdnený');
  }




}
