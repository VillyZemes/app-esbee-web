import { DefaultModel } from "../shared/models/DefaultModel";

export interface PromoCodeModel extends DefaultModel {
    code: string;
    hash: string;
    name?: string;
    description?: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    minimum_order_value?: number;
    maximum_discount_amount?: number;
    usage_limit?: number;
    usage_limit_per_customer?: number;
    used_count: number;
    is_active: boolean;
    is_featured: boolean;
    valid_from: string; // ISO datetime string
    valid_to: string;   // ISO datetime string
    applicable_categories?: number[]; // Assuming IDs of categories
    applicable_products?: number[];  // Assuming IDs of products
    first_time_customers_only: boolean;
}