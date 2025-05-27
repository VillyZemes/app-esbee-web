import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsModel } from '../shared/models/SettingsModel';
import { HttpCoreService } from '../shared/services/http-core.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends HttpCoreService {

  fetchSettings(): Observable<SettingsModel> {
    return this.callWebService<SettingsModel>('GET', `settings`);
  }

}
