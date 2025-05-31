import { ProductModel } from "../../models/Product.model";
import { ProductVariantModel } from "../../models/ProductVariant.model";

export interface CartModel {
    product_id: number;
    product_variant_id?: number;
    quantity: number;
}

export interface CartItemWithDetails extends CartModel {
    product?: ProductModel;
    variant?: ProductVariantModel;
    totalPrice?: number;
}