import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'sb-landing',
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  products = [
    { id: 1, name: 'Product 1', description: 'Short description of Product 1.', price: 19.99, image: 'images/p1.png' },
    { id: 2, name: 'Product 2', description: 'Short description of Product 2.', price: 29.99, image: 'images/p2.png' },
    { id: 3, name: 'Product 3', description: 'Short description of Product 3.', price: 39.99, image: 'images/p3.jpg' },
    { id: 4, name: 'Product 4', description: 'Short description of Product 4.', price: 49.99, image: 'images/p4.jpg' },
    { id: 5, name: 'Product 5', description: 'Short description of Product 5.', price: 59.99, image: 'images/p3.jpg' },
    { id: 6, name: 'Product 6', description: 'Short description of Product 6.', price: 69.99, image: 'images/p1.png' },
    { id: 7, name: 'Product 7', description: 'Short description of Product 7.', price: 79.99, image: 'images/p4.jpg' }
  ];

  productChunks: any[][] = [];
  currentSlideIndex = 0;
  productsPerSlide = 4; // Default for large screens

  constructor() {
    this.updateProductsPerSlide();
    this.chunkProducts();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateProductsPerSlide();
    this.chunkProducts();
  }

  updateProductsPerSlide(): void {
    const width = window.innerWidth;
    if (width >= 992) {
      this.productsPerSlide = 4; // Large screens (lg and above)
    } else if (width >= 768) {
      this.productsPerSlide = 2; // Medium screens (md)
    } else {
      this.productsPerSlide = 1; // Small screens (sm and below)
    }
  }

  chunkProducts(): void {
    this.productChunks = [];
    for (let i = 0; i < this.products.length; i += this.productsPerSlide) {
      this.productChunks.push(this.products.slice(i, i + this.productsPerSlide));
    }
  }

  get totalSlides(): number {
    return Math.ceil(this.products.length / this.productsPerSlide);
  }
}
