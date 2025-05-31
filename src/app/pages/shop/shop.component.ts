import { Component, Input, OnInit } from '@angular/core';
import { ProductModel } from '../../models/Product.model';
import { PricePipe } from '../../pipes/price.pipe';
import { CartService } from '../../services/cart.service';
import { CartModel } from '../../shared/models/CartModel';
import { MessageService } from '../../shared/services/message.service';
import { RecordsDataService } from '../../shared/services/records-data.service';
import { UtilsService } from '../../shared/services/utils.service';

@Component({
  selector: 'sb-shop',
  imports: [PricePipe],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  @Input() asComponent: boolean = false;


  products: ProductModel[] = [];

  constructor(
    public utilsService: UtilsService,
    private cartService: CartService,
    private messageService: MessageService,
    private recordsDataService: RecordsDataService,

  ) {
  }
  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.recordsDataService.recordsData$.subscribe((data) => {
      this.products = data.products;
    });
  }

  openProduct(product: ProductModel): void {
    this.utilsService.navigateTo(`/produkt/${product.slug}`);
  }

  onClickButton(product: ProductModel): void {
    if (this.asComponent) {
      this.addToCart(product);
    } else {
      this.openProduct(product);
    }
  }

  addToCart(product: ProductModel): void {
    const cartItem: CartModel = {
      product_id: product.id,
      product_variant_id: product.variants?.[0]?.id || 0, // Default to first variant if available
      quantity: 1
    };
    this.cartService.addToCart(cartItem);
    this.messageService.showInfo(`Produkt ${product.name} bol pridaný do košíka.`);
  }

}
