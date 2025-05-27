import { DefaultModel } from '../shared/models/DefaultModel';
import { ProductImage } from './ProductImage.model';
import { ProductRating } from './ProductRating.model';
import { ProductVariant } from './ProductVariant.model';

export interface Product extends DefaultModel {
    name: string;
    slug: string;
    description: string;
    long_description?: string;
    vat: number;
    price: string;
    original_price?: string;
    stock_quantity: number;
    in_stock: boolean;
    sku?: string;
    barcode?: string;
    available_colors: string[];
    default_color?: string;
    weight: string;
    dimensions?: string;
    features: string[];
    installation_instructions: string[];
    replacement_interval_weeks?: number;
    is_active: boolean;
    is_featured: boolean;
    sort_order?: number;
    meta_data?: any;

    overall_rating?: number;
    ratings_count?: number;
    sorted_ratings?: ProductRating[]
    ratings?: ProductRating[]

    // Relationships
    images?: ProductImage[];
    variants?: ProductVariant[];
}

