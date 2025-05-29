import { Component, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../models/Product.model';
import { ProductVariant } from '../../../models/ProductVariant.model';
import { CartModel } from '../../../shared/models/CartModel';
import { forkJoin } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { ProductsService } from '../../../services/products.service';
import { SettingsService } from '../../../services/settings.service';
import { SettingsModel } from '../../../shared/models/SettingsModel';
import { MessageService } from '../../../shared/services/message.service';
import { UtilsService } from '../../../shared/services/utils.service';
import { CommonModule } from '@angular/common';
import { PricePipe } from '../../../pipes/price.pipe';

interface CartItemWithDetails extends CartModel {
  product?: Product;
  variant?: ProductVariant;
  totalPrice?: number;
}

export interface CartTotals {
  totalPrice: number;
  totalWithoutVat: number;
  totalVat: number;
  //productsCount?: number;
}

@Component({
  selector: 'sb-cart-products',
  imports: [CommonModule, PricePipe],
  templateUrl: './cart-products.component.html',
  styleUrl: './cart-products.component.scss'
})
export class CartProductsComponent {
  @Output() cartTotalsChanged = new EventEmitter<CartTotals>();

  cartItems: CartItemWithDetails[] = [];
  isLoading = true;

  cartTotals: CartTotals = {
    totalPrice: 0,
    totalWithoutVat: 0,
    totalVat: 0,
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
          totalPrice: 0,
          totalWithoutVat: 0,
          totalVat: 0,
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
    this.cartTotals.totalPrice = this.cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0);

    this.cartTotals.totalVat = this.cartItems.reduce((total, item) => {
      const totalPrice = item.totalPrice || 0;
      const vatRate = (item.product?.vat || 0) / 100;
      const priceWithoutVat = totalPrice / (1 + vatRate);
      const vatAmount = totalPrice - priceWithoutVat;
      return total + vatAmount;
    }, 0);

    this.cartTotals.totalWithoutVat = this.cartTotals.totalPrice - this.cartTotals.totalVat;

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

  getPrimaryImage(product: Product): string {
    if (!product || !product.images) {
      return '';
    }
    const primaryImage = product.images.find(img => img.is_primary);
    return primaryImage?.image_path || product.images[0]?.image_path || '';
  }

  getColorDisplayName(color: string): string {
    return color === 'black' ? 'Čierna' : 'Biela';
  }


}
