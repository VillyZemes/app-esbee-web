import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderPostModel } from '../../models/OrderPost.model';
import { CartService } from '../../services/cart.service';
import { CartItemWithDetails, CartModel } from '../../shared/models/CartModel';
import { SettingsModel } from '../../shared/models/SettingsModel';
import { PacketaPickupPointModel } from '../../shared/packeta/models/PacketaPickupPointModel';
import { PacketaComponent } from '../../shared/packeta/packeta.component';
import { ProgressHeaderComponent } from '../../shared/progress-header/progress-header.component';
import { RecordsDataService } from '../../shared/services/records-data.service';
import { UtilsService } from '../../shared/services/utils.service';
import { StepCardComponent, StepConfig } from '../../shared/step-card/step-card.component';
import { CartBillingDetailsComponent } from './cart-billing-details/cart-billing-details.component';
import { CartEmptyComponent } from "./cart-empty/cart-empty.component";
import { CartPaymentComponent } from "./cart-payment/cart-payment.component";
import { CartProductsComponent, PriceTotals } from "./cart-products/cart-products.component";
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
  imports: [CommonModule, PacketaComponent, CartEmptyComponent,
    CartProductsComponent, CartSummaryComponent, ProgressHeaderComponent,
    StepCardComponent, CartBillingDetailsComponent, CartPaymentComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  @ViewChild('orderForm') orderFormComponent!: CartBillingDetailsComponent;

  productsCount: number = 0;
  cartTotals: PriceTotals = {
    price: 0,
    withoutVat: 0,
    vat: 0
  };
  cartItemWithDetails: CartItemWithDetails[];
  settings: SettingsModel;
  cart: CartModel[];

  // Delivery related properties
  selectedDeliveryType: 'pickup' | 'address' = null;
  selectedPickupPoint: any = null;
  selectedAddress: any = null;

  selectedPaymentMethod: 'card' | null = null; // This will hold the selected payment method

  // Form data
  orderFormData: any = null;
  orderData: OrderPostModel = null; // This will hold the complete order data to be sent to the backend

  shippingPrice: PriceTotals = null; // This will hold the shipping price

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
      disabled: (current) => current < CART_STEPS.PAYMENT,
      nextDisabled: () => !this.isPaymentSelected()

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
      disabled: (current) => current < CART_STEPS.FORM,
      nextDisabled: () => !this.isBillingFormValid()
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
    private recordsDataService: RecordsDataService,
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  onCartItemWithDetailsCompleted(cartItemWithDetails: CartItemWithDetails[]): void {
    this.cartItemWithDetails = cartItemWithDetails;
  }

  private loadCartItems(): void {
    this.recordsDataService.recordsData$.subscribe((data) => {
      this.settings = data.settings;
    });
    this.cartService.cart$.subscribe(cartItems => {
      this.productsCount = cartItems.length || 0;
      this.cart = cartItems;
    });
  }


  onCartTotalChanged(cartTotals: PriceTotals): void {
    this.cartTotals = cartTotals;
  }


  setCurrentStep(step: number): void {
    this.currentStep = step;
  }

  setCurrentStepAndScroll(step: number): void {
    this.setCurrentStep(step);
    const stepId = this.getStepElementId(step);
    this.utilsService.smoothNavigateTo(stepId, 80);
  }

  private getStepElementId(step: number): string {
    switch (step) {
      case CART_STEPS.PRODUCTS: return 'step-products';
      case CART_STEPS.DELIVERY: return 'step-delivery';
      case CART_STEPS.PAYMENT: return 'step-payment';
      case CART_STEPS.FORM: return 'step-form';
      case CART_STEPS.SUMMARY: return 'step-summary';
      default: return '';
    }
  }

  goToNextStep(currentStep: number): void {
    const config = this.getStepConfig(currentStep);

    // If we're on the form step (last step before summary), create the order
    if (currentStep === CART_STEPS.FORM) {
      // Trigger form submission
      this.orderFormComponent.onSubmit();
    }

    if (config?.nextStep) {
      this.setCurrentStepAndScroll(config.nextStep);
    }
  }

  goToPrevStep(currentStep: number): void {
    const config = this.getStepConfig(currentStep);
    if (config?.prevStep) {
      this.setCurrentStepAndScroll(config.prevStep);
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
        return `${this.productsCount} položiek • ${this.cartTotals.price}€`;
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

  onDeliveryTypeChanged(deliveryType: 'pickup' | 'address'): void {
    this.selectedDeliveryType = deliveryType;
  }

  onPickupPointSelected(point: PacketaPickupPointModel): void {
    this.selectedPickupPoint = point;
  }

  onPaymentMethodChanged(selectedPaymentMethod: any): void {
    this.selectedPaymentMethod = selectedPaymentMethod;
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

  isPaymentSelected(): boolean {
    return this.selectedPaymentMethod && this.selectedPaymentMethod === 'card';
  }

  isBillingFormValid(): boolean {
    return this.orderFormComponent?.orderForm?.valid || false;
  }

  getDeliverySubtitle(): string {
    if (this.currentStep < CART_STEPS.DELIVERY) {
      return 'Najprv dokončite výber produktov';
    } else if (this.currentStep > CART_STEPS.DELIVERY) {
      return this.getDeliveryTypeName();
    }
    return '';
  }

  onShippingPriceChanged(shippingPrice: number): void {
    if (shippingPrice !== null) {
      this.shippingPrice = this.utilsService.calculateVat(shippingPrice, this.settings.vat_rate);

    }
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

  onOrderFormSubmitted(formData: any): void {
    this.orderFormData = formData;
    this.prepareOrderData();
  }

  private prepareOrderData(): void {
    // Collect all order data
    this.orderData = {
      // Cart data
      cartItems: this.cart,

      // Delivery data
      deliveryType: this.selectedDeliveryType,
      pickupPoint: {
        id: this.selectedPickupPoint?.id || null,
        name: this.selectedPickupPoint?.name || null,
        url: this.selectedPickupPoint?.url || null
      },
      // Form data from the form component
      billingData: this.orderFormData,

      // Settings and metadata
    };

    console.log('Creating order with complete data:', this.orderData);
  }

}
