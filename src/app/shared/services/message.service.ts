import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageModel } from '../models/MessageModel';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  errorMessages$: BehaviorSubject<MessageModel[]> = new BehaviorSubject<MessageModel[]>([]);
  successMessages$: BehaviorSubject<MessageModel[]> = new BehaviorSubject<MessageModel[]>([]);
  warningMessages$: BehaviorSubject<MessageModel[]> = new BehaviorSubject<MessageModel[]>([]);
  infoMessages$: BehaviorSubject<MessageModel[]> = new BehaviorSubject<MessageModel[]>([]);

  constructor() { }

  processError(err: any): void {
    const errorMessages: MessageModel[] = [];
    console.log(err);

    // Process server messages
    if (err.messages) {
      for (const message of err.messages) {
        if (message?.message) {
          errorMessages.push(message);
        }
      }
    }

    // Process validation errors
    if (err.errors && typeof err.errors === 'object') {
      for (const key in err.errors) {
        if (err.errors.hasOwnProperty(key)) {
          err.errors[key].forEach((validationMessage: string) => {
            errorMessages.push({
              type: 'error',
              message: validationMessage,
              timestamp: new Date().toISOString()
            });
          });
        }
      }
    }

    // Fallback for generic error message
    if (errorMessages.length === 0 && err.message) {
      errorMessages.push({
        type: 'error',
        message: err.message,
        timestamp: new Date().toISOString()
      });
    }

    this.updateMessages(this.errorMessages$, errorMessages);
  }

  showSuccess(message: string | MessageModel): void {
    const successMessage: MessageModel =
      typeof message === 'string'
        ? { type: 'success', message: message, timestamp: new Date().toISOString() }
        : message;

    this.updateMessages(this.successMessages$, [successMessage]);
  }


  showWarning(message: string | MessageModel): void {
    const warningMessage: MessageModel =
      typeof message === 'string'
        ? { type: 'warning', message: message, timestamp: new Date().toISOString() }
        : message;

    this.updateMessages(this.warningMessages$, [warningMessage]);
  }

  showInfo(message: string | MessageModel): void {
    const infoMessage: MessageModel =
      typeof message === 'string'
        ? { type: 'info', message: message, timestamp: new Date().toISOString() }
        : message;

    this.updateMessages(this.infoMessages$, [infoMessage]);
  }

  showError(message: string | MessageModel): void {
    const errorMessage: MessageModel =
      typeof message === 'string'
        ? { type: 'error', message: message, timestamp: new Date().toISOString() }
        : message;

    this.updateMessages(this.errorMessages$, [errorMessage]);
  }


  private updateMessages(
    messageSubject: BehaviorSubject<MessageModel[]>,
    newMessages: MessageModel[]
  ): void {
    const currentMessages = messageSubject.value; // Get the current messages

    // Filter out duplicates based on message and timestamp
    const uniqueNewMessages = newMessages.filter(newMessage => {
      return !currentMessages.some(existingMessage =>
        existingMessage.message === newMessage.message &&
        existingMessage.timestamp === newMessage.timestamp
      );
    });


    // Add only unique messages
    if (uniqueNewMessages.length > 0) {
      const updatedMessages = [...currentMessages, ...uniqueNewMessages];

      // Trigger the BehaviorSubject with new messages
      messageSubject.next(updatedMessages);
    } else {
      console.log('No unique messages to add.');
    }
  }

}
