import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { SettingsService } from '../../services/settings.service';
import { PacketaComponent } from '../../shared/packeta/packeta.component';
import { ProgressHeaderComponent } from '../../shared/progress-header/progress-header.component';
import { UtilsService } from '../../shared/services/utils.service';
import { StepCardComponent, StepConfig } from '../../shared/step-card/step-card.component';
import { CartEmptyComponent } from "./cart-empty/cart-empty.component";
import { CartFinishOrderComponent } from "./cart-finish-order/cart-finish-order.component";
import { CartProductsComponent, CartTotals } from "./cart-products/cart-products.component";
import { CartSummaryComponent } from './cart-summary/cart-summary.component';

// Remove enum, use constants instead
const CART_STEPS = {
  PRODUCTS: 1,
  DELIVERY: 2,
  PAYMENT: 3,
  FORM: 4,
  SUMMARY: 5
} as const;

@Component({
  selector: 'sb-cart',
  imports: [CommonModule, PacketaComponent, CartEmptyComponent, CartProductsComponent, CartSummaryComponent, ProgressHeaderComponent, StepCardComponent, CartFinishOrderComponent],
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

  // Delivery related properties
  selectedDeliveryType: string = '';
  selectedPickupPoint: any = null;
  selectedAddress: any = null;

  currentStep: number = CART_STEPS.PRODUCTS;
  readonly CART_STEPS = CART_STEPS;
  readonly totalSteps = Object.keys(CART_STEPS).length; // enum has both numeric and string keys

  readonly stepConfigs: StepConfig[] = [
    {
      id: 'products',
      step: CART_STEPS.PRODUCTS,
      title: 'Produkty v košíku',
      nextStep: CART_STEPS.DELIVERY,
      showBackButton: false,
      showActions: true,
      showEditIcon: true
    },
    {
      id: 'delivery',
      step: CART_STEPS.DELIVERY,
      title: 'Doprava',
      nextStep: CART_STEPS.PAYMENT,
      prevStep: CART_STEPS.PRODUCTS,
      showBackButton: true,
      showActions: true,
      showEditIcon: true,
      disabled: (current) => current < CART_STEPS.DELIVERY,
      nextDisabled: () => !this.isDeliverySelected()
    },
    {
      id: 'payment',
      step: CART_STEPS.PAYMENT,
      title: 'Platba',
      nextStep: CART_STEPS.FORM,
      prevStep: CART_STEPS.DELIVERY,
      showBackButton: true,
      showActions: true,
      showEditIcon: true,
      disabled: (current) => current < CART_STEPS.PAYMENT
    },
    {
      id: 'form',
      step: CART_STEPS.FORM,
      title: 'Fakturačné údaje',
      nextStep: CART_STEPS.SUMMARY,
      prevStep: CART_STEPS.PAYMENT,
      showBackButton: true,
      showActions: true,
      showEditIcon: true,
      disabled: (current) => current < CART_STEPS.FORM
    },
    {
      id: 'summary',
      step: CART_STEPS.SUMMARY,
      title: 'Súhrn a dokončenie',
      prevStep: CART_STEPS.FORM,
      showBackButton: false,
      showActions: false,
      showEditIcon: false,
      disabled: (current) => current < CART_STEPS.SUMMARY
    }
  ];

  constructor(
    private cartService: CartService,
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

  goToNextStep(currentStep: number): void {
    const config = this.getStepConfig(currentStep);
    if (config?.nextStep) {
      this.setCurrentStep(config.nextStep);
    }
  }

  goToPrevStep(currentStep: number): void {
    const config = this.getStepConfig(currentStep);
    if (config?.prevStep) {
      this.setCurrentStep(config.prevStep);
    }
  }

  getStepConfig(step: number): StepConfig | undefined {
    return this.stepConfigs.find(config => config.step === step);
  }

  isStepActive(step: number): boolean {
    return this.currentStep === step;
  }

  isStepCompleted(step: number): boolean {
    return this.currentStep > step;
  }

  isStepDisabled(step: number): boolean {
    const config = this.getStepConfig(step);
    return config?.disabled ? config.disabled(this.currentStep) : false;
  }

  getConfigWithSubtitle(config: StepConfig): StepConfig {
    return {
      ...config,
      subtitle: this.getStepSubtitle(config.step)
    };
  }

  isNextButtonDisabled(step: number): boolean {
    const config = this.getStepConfig(step);
    return config?.nextDisabled ? config.nextDisabled() : false;
  }

  getStepSubtitle(step: number): string {
    switch (step) {
      case CART_STEPS.PRODUCTS:
        return `${this.productsCount} položiek • ${this.cartTotals.totalPrice}€`;
      case CART_STEPS.DELIVERY:
        return this.getDeliverySubtitle();
      case CART_STEPS.PAYMENT:
        return this.getPaymentSubtitle();
      case CART_STEPS.FORM:
        return this.getFormSubtitle();
      case CART_STEPS.SUMMARY:
        return this.currentStep < CART_STEPS.SUMMARY ? 'Najprv dokončite výber platobnej metódy' : '';
      default:
        return '';
    }
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

  getDeliverySubtitle(): string {
    if (this.currentStep < CART_STEPS.DELIVERY) {
      return 'Najprv dokončite výber produktov';
    } else if (this.currentStep > CART_STEPS.DELIVERY) {
      return this.getDeliveryTypeName();
    }
    return '';
  }

  getPaymentSubtitle(): string {
    if (this.currentStep < CART_STEPS.PAYMENT) {
      return 'Najprv dokončite výber dopravy a doručenia';
    } else if (this.currentStep === CART_STEPS.PAYMENT) {
      return this.isDeliverySelected() ? 'Vyberte spôsob platby' : 'Najprv vyberte spôsob dopravy';
    } else if (this.currentStep > CART_STEPS.PAYMENT) {
      return 'TODO: Zobraziť dostupné platobné metódy';
    }
    return '';
  }

  getFormSubtitle(): string {
    if (this.currentStep < CART_STEPS.FORM) {
      return 'Najprv dokončite výber platobnej metódy';
    } else if (this.currentStep > CART_STEPS.FORM) {
      return 'TODO: ';
    }
    return '';
  }

  onFinishOrder(orderData: any): void {
    console.log('Dokončiť objednávku:', orderData);
    // Implementácia dokončenia objednávky
  }
}
