import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';
import { MessageService } from '../../shared/services/message.service';
import { CartModel } from '../../shared/models/CartModel';
import { Product } from '../../models/Product.model';
import { ProductVariant } from '../../models/ProductVariant.model';
import { PricePipe } from '../../pipes/price.pipe';
import { Observable, forkJoin, map } from 'rxjs';
import { UtilsService } from '../../shared/services/utils.service';
import { SettingsService } from '../../services/settings.service';
import { SettingsModel } from '../../shared/models/SettingsModel';

interface CartItemWithDetails extends CartModel {
  product?: Product;
  variant?: ProductVariant;
  totalPrice?: number;
}

@Component({
  selector: 'sb-cart',
  imports: [CommonModule, RouterLink, PricePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: CartItemWithDetails[] = [];
  isLoading = true;
  cartTotal = 0;
  cartTotalWithoutVat = 0;
  cartTotalVat = 0;
  freeShippingThreshold: number = null;

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
        this.cartTotal = 0;
        this.cartTotalWithoutVat = 0;
        this.cartTotalVat = 0;
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

      // Add settings request to forkJoin
      const allRequests = [
        ...productRequests,
        this.settingsService.fetchSettings()
      ];

      forkJoin(allRequests).subscribe(results => {
        // Separate products from settings (settings will be last in array)
        const products = results.slice(0, -1) as Product[];
        const settings = results[results.length - 1] as SettingsModel;
        this.freeShippingThreshold = settings.free_shipping_threshold || 0;


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
  }

  private calculateTotal(): void {
    this.cartTotal = this.cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0);

    this.cartTotalVat = this.cartItems.reduce((total, item) => {
      const totalPrice = item.totalPrice || 0;
      const vatRate = (item.product?.vat || 0) / 100;
      const priceWithoutVat = totalPrice / (1 + vatRate);
      const vatAmount = totalPrice - priceWithoutVat;
      return total + vatAmount;
    }, 0);

    this.cartTotalWithoutVat = this.cartTotal - this.cartTotalVat;
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

  getPrimaryImage(product: Product): string {
    const primaryImage = product.images?.find(img => img.is_primary);
    return primaryImage?.image_path || product.images?.[0]?.image_path || '';
  }

  getColorDisplayName(color: string): string {
    return color === 'black' ? 'Čierna' : 'Biela';
  }
}
