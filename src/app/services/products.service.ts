import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCoreService } from '../shared/services/http-core.service';
import { ProductModel } from '../models/Product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsServiceDeprecated extends HttpCoreService {

  /**
   * Get all products with optional filters and pagination
   */
  /* getProducts(): Observable<ProductModel[]> {
    const params: any = {};

    return this.callWebService<ProductModel[]>('GET', 'products', undefined, params);
  } */

  /**
   * Get a single product by ID or slug
   */
  /* getProduct(identifier: string | number): Observable<ProductModel> {
    return this.callWebService<ProductModel>('GET', `products/${identifier}`);
  } */

}
