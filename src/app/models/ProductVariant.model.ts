import { DefaultModel } from '../shared/models/DefaultModel';
import { Product } from './Product.model';
import { ProductImage } from './ProductImage.model';

export interface ProductVariant extends DefaultModel {
    product_id: number;
    color: string;
    color_code?: string;
    sku?: string;
    barcode?: string;
    price_adjustment: string;
    stock_quantity: number;
    is_active: boolean;
    is_default: boolean;
    sort_order?: number;
    metadata?: any;

    // Relationships
    product?: Product;
    images?: ProductImage[];
}
