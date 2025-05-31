import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCoreService } from '../shared/services/http-core.service';

export interface PromoCodeValidationResponse {
  valid: boolean;
  message: string;
  promo_code: {
    code: string;
    name?: string;
    description?: string;
    discount_value: number;
    discount_amount?: number;
  }
}

export interface PromoCodeValidationPayload {
  code: string;
  order_value: number;
}

@Injectable({
  providedIn: 'root'
})
export class PromoCodesService extends HttpCoreService {

  /* fetchFeatured(): Observable<PromoCodeModel> {
    return this.callWebService<PromoCodeModel>('GET', 'promo-code/featured');
  } */

  validate(payload: PromoCodeValidationPayload): Observable<PromoCodeValidationResponse> {
    return this.callWebServiceNoLoading<PromoCodeValidationResponse>('POST', `promo-code/validate`, payload);
  }

}
