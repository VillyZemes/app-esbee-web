import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { OrderPostModel } from '../../../models/OrderPostModel';
import { PricePipe } from '../../../pipes/price.pipe';
import { CartItemWithDetails } from '../../../shared/models/CartModel';
import { SettingsModel } from '../../../shared/models/SettingsModel';
import { UtilsService } from '../../../shared/services/utils.service';
import { PriceTotals } from '../cart-products/cart-products.component';

@Component({
  selector: 'sb-cart-summary',
  imports: [PricePipe, CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss'
})
export class CartSummaryComponent implements OnInit, OnChanges {
  @Input() cartTotals: PriceTotals = {
    price: 0,
    withoutVat: 0,
    vat: 0,
  };
  @Input() freeShippingThreshold: number = null;
  @Input() productsCount: number = null;
  @Input() shippingPrice: PriceTotals = null;
  @Input() orderData: OrderPostModel = null;
  @Input() settings: SettingsModel = null;
  @Input() cartItemWithDetails: CartItemWithDetails[] = null;

  summaryTotals: PriceTotals = {
    price: 0,
    withoutVat: 0,
    vat: 0,
  };

  constructor(
    public utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cartTotals'] || changes['shippingPrice']) {
      console.log(this.shippingPrice, this.cartTotals);
      this.summaryTotals = {
        price: this.cartTotals.price + (this.shippingPrice ? this.shippingPrice.price : 0),
        withoutVat: this.cartTotals.withoutVat + (this.shippingPrice ? this.shippingPrice.withoutVat : 0),
        vat: this.cartTotals.vat + (this.shippingPrice ? this.shippingPrice.vat : 0),
      };
    }
  }


  getDeliveryText(): string {
    if (this.orderData?.pickupPoint?.name) {
      return 'Výdajné miesto a Z-BOX: ' + this.orderData.pickupPoint.name;
    }
    if (this.orderData.billingData.differentShipping && this.orderData.billingData.shippingAddress) {
      return `${this.orderData.billingData.shippingAddress.street}, ${this.orderData.billingData.shippingAddress.postalCode} ${this.orderData.billingData.shippingAddress.city}`;
    } else {
      return `${this.orderData.billingData.street}, ${this.orderData.billingData.postalCode} ${this.orderData.billingData.city}`;
    }
  }

  getShippingPriceText(): string {
    if (this.shippingPrice?.price === 0) {
      return 'Doprava zdarma';
    } else if (this.shippingPrice === null) {
      return 'Doprava nie je dostupná';
    } else {
      return `${PricePipe.formatPrice(this.shippingPrice.price)}`;
    }
  }
}
