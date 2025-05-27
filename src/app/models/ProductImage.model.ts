import { DefaultModel } from '../shared/models/DefaultModel';
import { Product } from './Product.model';

export interface ProductImage extends DefaultModel {
    product_id: number;
    image_path: string;
    image_url?: string;
    alt_text?: string;
    type: string;
    sort_order: number;
    is_primary: boolean;
    color_variant?: string;
    metadata?: any;

    // Relationships
    product?: Product;
}
