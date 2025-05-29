import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PricePipe } from '../../pipes/price.pipe';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';
import { SettingsService } from '../../services/settings.service';
import { PacketaComponent } from '../../shared/packeta/packeta.component';
import { MessageService } from '../../shared/services/message.service';
import { UtilsService } from '../../shared/services/utils.service';
import { CartEmptyComponent } from "./cart-empty/cart-empty.component";
import { CartProductsComponent, CartTotals } from "./cart-products/cart-products.component";
import { CartSummaryComponent } from './cart-summary/cart-summary.component';
import { ProgressHeaderComponent } from '../../shared/progress-header/progress-header.component';



@Component({
  selector: 'sb-cart',
  imports: [CommonModule, PricePipe, PacketaComponent, CartEmptyComponent, CartProductsComponent, CartSummaryComponent, ProgressHeaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  productsCount: number = 0;
  cartTotals: CartTotals = {
    totalPrice: 0,
    totalWithoutVat: 0,
    totalVat: 0
  };
  freeShippingThreshold: number = null;

  currentStep = 1;
  selectedDeliveryType = '';
  selectedPickupPoint: any = null;
  selectedAddress: any = null;

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
    this.settingsService.fetchSettings().subscribe(settings => {
      this.freeShippingThreshold = settings.free_shipping_threshold || 0;
    });
    this.cartService.cart$.subscribe(cartItems => {
      this.productsCount = cartItems.length || 0;
    });
  }


  onCartTotalChanged(cartTotals: CartTotals): void {
    this.cartTotals = cartTotals;
  }


  setCurrentStep(step: number): void {
    this.currentStep = step;
  }

  onDeliveryTypeChanged(deliveryType: string): void {
    this.selectedDeliveryType = deliveryType;
  }

  onPickupPointSelected(point: any): void {
    this.selectedPickupPoint = point;
  }

  onAddressSelected(address: any): void {
    this.selectedAddress = address;
  }

  getDeliveryTypeName(): string {
    switch (this.selectedDeliveryType) {
      case 'pickup':
        return 'Packeta - Výdajné miesto';
      case 'address':
        return 'Packeta - Doručenie na adresu';
      default:
        return 'Nie je vybraná';
    }
  }

  isDeliverySelected(): boolean {
    return this.selectedDeliveryType && 
           ((this.selectedDeliveryType === 'pickup' && this.selectedPickupPoint) ||
            (this.selectedDeliveryType === 'address' && this.selectedAddress));
  }
}
