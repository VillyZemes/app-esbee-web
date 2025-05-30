import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UtilsService } from '../../../shared/services/utils.service';

@Component({
  selector: 'sb-cart-payment',
  imports: [FormsModule, CommonModule],
  templateUrl: './cart-payment.component.html',
  styleUrl: './cart-payment.component.scss'
})
export class CartPaymentComponent {
  @Output() paymentMethodChanged = new EventEmitter<'card' | null>();

  paymentMethod: 'card' | null = null;

  constructor(
    public utilsService: UtilsService,
  ) { }

  onPaymentMethodChange(event: any): void {
    this.paymentMethod = event.target.value;
    this.paymentMethodChanged.emit(this.paymentMethod);
  }
}
