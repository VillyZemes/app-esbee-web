import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sbPrice',
  standalone: true
})
export class PricePipe implements PipeTransform {

  transform(value: string | number): string | null {
    return PricePipe.formatPrice(value);
  }

  /**
   * Static method to format price - can be used without pipe injection
   * Keeps formatting logic in one place
   */
  static formatPrice(value: string | number): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    // Convert input to a number
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    // Check if it's a valid number
    if (isNaN(numValue)) {
      return null;
    }

    // Format with 2 decimal places and add euro sign
    let resultDot = numValue.toFixed(2) + '€';
    let resultComma = resultDot.replace('.', ',');
    return resultComma;
  }
}
