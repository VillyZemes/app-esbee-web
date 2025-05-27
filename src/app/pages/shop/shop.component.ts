import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/Product.model';
import { UtilsService } from '../../shared/services/utils.service';
import { PricePipe } from '../../pipes/price.pipe';
import { ProductsService } from '../../services/products.service';
import { CartModel } from '../../shared/models/CartModel';
import { CartService } from '../../services/cart.service';
import { MessageService } from '../../shared/services/message.service';

@Component({
  selector: 'sb-shop',
  imports: [PricePipe],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  @Input() asComponent: boolean = false;


  products: Product[] = [];

  constructor(
    public utilsService: UtilsService,
    private productsService: ProductsService,
    private cartService: CartService,
    private messageService: MessageService,

  ) {
  }
  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  openProduct(product: Product): void {
    this.utilsService.navigateTo(`/produkt/${product.slug}`);
  }

  onClickButton(product: Product): void {
    if (this.asComponent) {
      this.addToCart(product);
    } else {
      this.openProduct(product);
    }
  }

  addToCart(product: Product): void {
    const cartItem: CartModel = {
      product_id: product.id,
      product_variant_id: product.variants?.[0]?.id || 0, // Default to first variant if available
      quantity: 1
    };
    this.cartService.addToCart(cartItem);
    this.messageService.showInfo(`Produkt ${product.name} bol pridaný do košíka.`);
  }

}
