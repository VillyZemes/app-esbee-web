import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModel } from '../../models/MessageModel';
import { MessageService } from '../../services/message.service';


@Component({
  selector: 'cc-toast-notification',
  imports: [
    CommonModule, /* TranslateModule */
  ],
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss']
})
export class ToastNotificationComponent implements OnInit {
  allMessages: MessageModel[] = [];
  private maxMessages = 1; // Show only the most recent message

  constructor(
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.subscribeToMessages();
  }

  private subscribeToMessages(): void {
    this.messageService.errorMessages$.subscribe((messages: MessageModel[]) => {
      this.updateMessages(messages);
    });

    this.messageService.successMessages$.subscribe((messages: MessageModel[]) => {
      this.updateMessages(messages);
    });

    this.messageService.warningMessages$.subscribe((messages: MessageModel[]) => {
      this.updateMessages(messages);
    });

    this.messageService.infoMessages$.subscribe((messages: MessageModel[]) => {
      this.updateMessages(messages);
    });
  }

  private updateMessages(newMessages: MessageModel[]): void {
    if (newMessages && newMessages.length > 0) {
      newMessages.forEach(message => this.setAutoDismiss(message)); // Schedule auto-dismiss for each new message

      // Add new messages and keep only the most recent one
      this.allMessages = [...this.allMessages, ...newMessages]
        .filter((msg, index, self) => self.findIndex(m => m.message === msg.message && m.type === msg.type) === index) // Ensure uniqueness
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Order by timestamp DESC
        .slice(0, this.maxMessages); // Keep only the most recent message
    }
  }



  setAutoDismiss(message: MessageModel): void {
    setTimeout(() => {
      this.allMessages = this.allMessages.filter(msg => msg !== message);
    }, 5000);
  }


  // Method to close a specific message manually
  removeMessage(message: MessageModel): void {
    this.allMessages = this.allMessages.filter(msg => msg !== message);
  }

  getMessagesByType(type: string): MessageModel[] {
    return this.allMessages.filter(msg => msg.type === type);
  }

  getIconByType(type: string): string {
    switch (type) {
      case 'error': return 'error';
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  }

  /* getTitleByType(type: string): string {
    switch (type) {
      case 'error': return 'MESSAGES.ERROR';
      case 'success': return 'MESSAGES.SUCCESS';
      case 'warning': return 'MESSAGES.WARNING';
      case 'info': return 'MESSAGES.INFORMATION';
      default: return 'MESSAGES.INFORMATION';
    }
  } */

}
