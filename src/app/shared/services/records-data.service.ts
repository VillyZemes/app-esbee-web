import { Injectable } from '@angular/core';
import { RecordsDataModel } from '../../models/RecordsData.model';
import { HttpCoreService } from './http-core.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordsDataService extends HttpCoreService {

  public recordsData$ = new Subject<RecordsDataModel>();

  fetchRecordsData(): Observable<RecordsDataModel> {
    return this.callWebService<RecordsDataModel>('POST', 'records/data', null);
  }
}
