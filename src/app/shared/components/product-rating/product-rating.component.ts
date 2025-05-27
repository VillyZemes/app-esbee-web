import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRating } from '../../../models/ProductRating.model';

@Component({
    selector: 'sb-product-rating',
    imports: [CommonModule],
    templateUrl: './product-rating.component.html',
    styleUrl: './product-rating.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductRatingComponent {
    @Input() overallRating: number = 0;
    @Input() ratingsCount: number = 0;
    @Input() sortedRatings: ProductRating[] = [];

    getStarArray(): string[] {
        const rating = this.overallRating || 0;
        const stars: string[] = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push('full');
        }

        // Add half star if needed
        if (hasHalfStar) {
            stars.push('half');
        }

        // Add empty stars to make total of 5
        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push('empty');
        }

        return stars;
    }
}
