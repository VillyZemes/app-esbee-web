import { DefaultModel } from '../shared/models/DefaultModel';
import { ProductModel } from './Product.model';

export interface ProductRating extends DefaultModel {
    product_id: number;
    rating: number;
    message?: string;
    user_name: string;
    is_verified: boolean;
    is_active: boolean;

    // Relationships
    product?: ProductModel;
}
