import { Component, Input } from '@angular/core';
import { CartTotals } from '../cart-products/cart-products.component';
import { PricePipe } from '../../../pipes/price.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sb-cart-summary',
  imports: [PricePipe, CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss'
})
export class CartSummaryComponent {
  @Input() cartTotals: CartTotals = {
    totalPrice: 0,
    totalWithoutVat: 0,
    totalVat: 0
  };
  @Input() freeShippingThreshold: number = null;
  @Input() productsCount: number = null;
}
