import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PricePipe } from '../../../pipes/price.pipe';
import { PromoCodesService, PromoCodeValidationPayload, PromoCodeValidationResponse } from '../../../services/promo-codes.service';
import { FormFieldComponent } from '../../../shared/form-field/form-field.component';
import { UtilsService } from '../../../shared/services/utils.service';
import { MessageService } from '../../../shared/services/message.service';
import { OrderPostModel } from '../../../models/OrderPost.model';
import { CartItemWithDetails } from '../../../shared/models/CartModel';
import { SettingsModel } from '../../../shared/models/SettingsModel';
import { PriceTotals } from '../cart-products/cart-products.component';

@Component({
  selector: 'sb-cart-summary',
  imports: [CommonModule, PricePipe, ReactiveFormsModule, FormFieldComponent],
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

  // Promo code properties
  promoForm: FormGroup;
  appliedPromoCode: PromoCodeValidationResponse = null;
  promoCodeMessage: string = '';
  promoCodeValid: boolean = false;
  isValidatingPromo: boolean = false;

  constructor(
    public utilsService: UtilsService,
    private promoCodesService: PromoCodesService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.promoForm = this.fb.group({
      promoCode: ['', [Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cartTotals'] || changes['shippingPrice']) {
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

  validatePromoCode(): void {
    if (!this.promoForm.valid) {
      return;
    }
    const promoCode = this.promoForm.get('promoCode')?.value?.trim();
    if (!promoCode) return;

    this.isValidatingPromo = true;
    this.promoCodeMessage = '';

    const payload: PromoCodeValidationPayload = {
      code: promoCode,
      order_value: this.summaryTotals?.price || 0
    };

    this.promoCodesService.validate(payload).subscribe({
      next: (response: PromoCodeValidationResponse) => {
        this.appliedPromoCode = response;
        this.orderData.promoCode = this.appliedPromoCode.promo_code.code;
        this.isValidatingPromo = false;
        this.promoCodeValid = response.valid;
        this.promoCodeMessage = response.message;

        if (response.valid && response.promo_code) {
          this.promoForm.get('promoCode')?.setValue('');
          this.messageService.showSuccess(`Zľavový kód ${this.appliedPromoCode?.promo_code?.name} - ${this.appliedPromoCode?.promo_code?.description} bol úspešne aplikovaný!`);

        }
      },
      error: (error) => {
        this.isValidatingPromo = false;
        this.promoCodeValid = false;
        this.promoCodeMessage = 'Chyba pri overovaní kódu. Skúste to znova.';
      }
    });
  }

  removePromoCode(): void {
    this.appliedPromoCode = null;
    this.promoCodeMessage = '';
    this.promoCodeValid = false;
    this.promoForm.get('promoCode')?.setValue('');
    this.messageService.showInfo('Zľavový kód bol odstránený');
    // TODO: Recalculate prices without discount
  }

  get promoCodeValue(): string {
    return this.promoForm.get('promoCode')?.value || '';
  }

  onOrderSubmit(): void {
    console.log('Order submitted:', this.orderData);
  }
}
