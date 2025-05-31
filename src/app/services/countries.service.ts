import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryModel } from '../models/Country.model';
import { HttpCoreService } from '../shared/services/http-core.service';

@Injectable({
  providedIn: 'root'
})
export class CountriesServiceDeprecated extends HttpCoreService {

  /* fetchCountries(): Observable<CountryModel[]> {
    return this.callWebService<CountryModel[]>('GET', 'countries');
  } */

}
