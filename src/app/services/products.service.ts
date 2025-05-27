import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCoreService } from '../shared/services/http-core.service';
import { Product } from '../models/Product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends HttpCoreService {

  /**
   * Get all products with optional filters and pagination
   */
  getProducts(): Observable<Product[]> {
    const params: any = {};

    return this.callWebService<Product[]>('GET', 'products', undefined, params);
  }

  /**
   * Get a single product by ID or slug
   */
  getProduct(identifier: string | number): Observable<Product> {
    return this.callWebService<Product>('GET', `products/${identifier}`);
  }

}
