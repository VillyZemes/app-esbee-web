import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryModel } from '../models/Country.model';
import { HttpCoreService } from '../shared/services/http-core.service';
import { ContactMessageModel } from '../models/ContactMessage.model';

export interface ContactMessageStoreResponse { success: boolean, message: string };

@Injectable({
  providedIn: 'root'
})
export class ContactMessagesService extends HttpCoreService {

  storeMessage(payload: ContactMessageModel): Observable<ContactMessageStoreResponse> {
    return this.callWebService<ContactMessageStoreResponse>('POST', 'contact-message', payload);
  }

}
