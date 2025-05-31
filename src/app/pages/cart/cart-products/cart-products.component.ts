import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductModel } from '../../../models/Product.model';
import { PricePipe } from '../../../pipes/price.pipe';
import { CartService } from '../../../services/cart.service';
import { BannerFreeShippingComponent } from "../../../shared/components/banner-free-shipping/banner-free-shipping.component";
import { CartItemWithDetails, CartModel } from '../../../shared/models/CartModel';
import { SettingsModel } from '../../../shared/models/SettingsModel';
import { MessageService } from '../../../shared/services/message.service';
import { RecordsDataService } from '../../../shared/services/records-data.service';
import { UtilsService } from '../../../shared/services/utils.service';



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
  products: ProductModel[] = [];

  cartTotals: PriceTotals = {
    price: 0,
    withoutVat: 0,
    vat: 0,
  };

  constructor(
    private cartService: CartService,
    private messageService: MessageService,
    public utilsService: UtilsService,
    private recordsDataService: RecordsDataService,
  ) { }

  ngOnInit(): void {
    this.recordsDataService.recordsData$.subscribe((data) => {
      this.products = data.products;
      this.loadCartItems();
    });

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

      // Use products from local array instead of fetching from backend
      this.cartItems = cartItems.map(item => {
        const product = this.products.find(p => p.id === item.product_id);
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
      }).filter(item => item.product); // Only keep items that have product data

      this.calculateTotal();
      this.cartItemWithDetailsCompleted.emit(this.cartItems);
      this.isLoading = false;
    });
  }

  openProduct(product: ProductModel): void {
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
