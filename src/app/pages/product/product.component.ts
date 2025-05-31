import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SectionEsbeeAboutComponent } from "../../core/section-esbee-about/section-esbee-about.component";
import { SectionSpecialOffersComponent } from '../../core/section-special-offers/section-special-offers.component';
import { ProductModel } from '../../models/Product.model';
import { ProductVariantModel } from '../../models/ProductVariant.model';
import { PricePipe } from '../../pipes/price.pipe';
import { CartService } from '../../services/cart.service';
import { ProductRatingComponent } from '../../shared/components/product-rating/product-rating.component';
import { CartModel } from '../../shared/models/CartModel';
import { RecordsDataService } from '../../shared/services/records-data.service';

@Component({
  selector: 'sb-product',
  imports: [PricePipe, CommonModule, ReactiveFormsModule, ProductRatingComponent, SectionEsbeeAboutComponent, SectionSpecialOffersComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit {
  product: ProductModel;
  addToCartForm: FormGroup;
  currentMainImage: string = '';
  selectedVariant: ProductVariantModel | null = null;
  products: ProductModel[] = [];
  subheader = 'Modul + krabička';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private recordsDataService: RecordsDataService,
  ) { }

  ngOnInit(): void {
    // get the id from the URL route parameters
    const productId = this.route.snapshot.paramMap.get('id');
    this.recordsDataService.recordsData$.subscribe((data) => {
      this.products = data.products;
      this.loadProduct(productId);
    });

  }

  private loadProduct(productId: string | null): void {
    // Load product data from local array
    if (productId) {
      this.product = this.products.find(p => p.slug === productId || p.id.toString() === productId);

      if (this.product) {
        // Set initial main image after product is loaded
        this.currentMainImage = this.getPrimaryImage();
        // Set initial selected variant
        this.selectedVariant = this.getDefaultVariant();

        // Initialize form after product data is loaded
        this.addToCartForm = this.fb.group({
          itemCount: [1, Validators.required], // Default count is 1
          variant: [this.selectedVariant?.id, Validators.required] // Default variant
        });

        // Trigger change detection
        this.cdr.detectChanges();
      } else {
        console.error('Product not found:', productId);
      }
    }
  }

  addToCart(): void {
    if (this.addToCartForm.valid && this.product) {
      const formData = this.addToCartForm.value;
      const itemCount = formData.itemCount || 1;
      const variantId = formData.variant;

      const cartItem: CartModel = {
        product_id: this.product.id,
        product_variant_id: variantId,
        quantity: itemCount
      };

      this.cartService.addToCart(cartItem);

      // Reset form after adding to cart
      this.addToCartForm.patchValue({ itemCount: 1 });

      console.log(`Added ${itemCount} of variant ${variantId} to cart.`);
    } else {
      console.error('Form is invalid or product not loaded');
    }
  }

  getDefaultVariant(): ProductVariantModel | null {
    return this.product?.variants?.find(variant => variant.is_default) || this.product?.variants?.[0] || null;
  }

  selectVariant(variant: ProductVariantModel): void {
    this.selectedVariant = variant;
    this.addToCartForm.get('variant')?.setValue(variant.id);
  }

  isSelectedVariant(variant: ProductVariantModel): boolean {
    return this.selectedVariant?.id === variant.id;
  }

  getPrimaryImage(): string {
    if (!this.product?.images) return '';
    const primaryImage = this.product.images.find(img => img.is_primary);
    return primaryImage?.image_path || this.product.images[0]?.image_path || '';
  }

  changeMainImage(imagePath: string): void {
    this.currentMainImage = imagePath;
  }

  getColorDisplayName(): string {
    return this.product?.default_color === 'black' ? 'Čierna' : 'Biela';
  }

  isDefaultColor(color: string): boolean {
    return color === this.product?.default_color;
  }

  getReplacementInterval(): string {
    const weeks = this.product?.replacement_interval_weeks || 4;
    return `(Pre maximálny účinok odporúčame meniť v intervale ${weeks - 1}-${weeks + 1} týždňov.)`;
  }

  incrementCount(): void {
    const currentValue = this.addToCartForm.get('itemCount')?.value || 1;
    this.addToCartForm.get('itemCount')?.setValue(currentValue + 1);
  }

  decrementCount(): void {
    const currentValue = this.addToCartForm.get('itemCount')?.value || 1;
    if (currentValue > 1) {
      this.addToCartForm.get('itemCount')?.setValue(currentValue - 1);
    }
  }

  getStockMessage(): string {
    if (this.product?.stock_quantity === 0) {
      return 'Momentálne nedostupné';
    } else if (this.product?.stock_quantity < 5) {
      return 'Posledné kusy na sklade';
    } else if (this.product?.stock_quantity >= 5 && this.product?.stock_quantity < 10) {
      return 'Na sklade viac ako 5 ks';
    } else if (this.product?.stock_quantity >= 10) {
      return 'Na sklade viac ako 10 ks';
    } else {
      return 'Na sklade';
    }
  }
}
