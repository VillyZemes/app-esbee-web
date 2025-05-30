import { Product } from "../../models/Product.model";
import { ProductVariant } from "../../models/ProductVariant.model";

export interface CartModel {
    product_id: number;
    product_variant_id?: number;
    quantity: number;
}

export interface CartItemWithDetails extends CartModel {
    product?: Product;
    variant?: ProductVariant;
    totalPrice?: number;
}