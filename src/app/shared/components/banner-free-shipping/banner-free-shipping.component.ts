import { Component, Input } from '@angular/core';
import { PricePipe } from '../../../pipes/price.pipe';

@Component({
  selector: 'sb-banner-free-shipping',
  imports: [PricePipe],
  templateUrl: './banner-free-shipping.component.html',
  styleUrl: './banner-free-shipping.component.scss'
})
export class BannerFreeShippingComponent {
  @Input() freeShippingThreshold: number = null;
  @Input() price: number = null;
  @Input() shippingPrice: number = null;
}
