import { CartModel } from "../shared/models/CartModel";
import { PacketaPickupPointModel } from "../shared/packeta/models/PacketaPickupPointModel";

export interface OrderPostModel {
    cartItems: CartModel[];
    deliveryType: 'pickup' | 'address';
    pickupPoint?: Partial<PacketaPickupPointModel>;
    billingData: BillingData;
    promoCode?: string;
}

export interface BillingData {
    firstName: string;
    lastName: string;
    isCompany: boolean;
    companyName?: string;
    ico?: string;
    dic?: string;
    icdph?: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    differentShipping: boolean;
    shippingAddress?: ShippingAddress;
    notes?: string;
    acceptTerms: boolean;
    newsletter: boolean;
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    companyName?: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
}

