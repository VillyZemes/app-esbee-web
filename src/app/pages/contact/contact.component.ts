import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { COMPANY_CONSTANTS } from '../../constants/Company.constants';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { ContactMessageModel } from '../../models/ContactMessage.model';
import { ContactMessagesService } from '../../services/contact-messages.service';
import { MessageService } from '../../shared/services/message.service';

@Component({
  selector: 'sb-contact',
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  companyInfo = COMPANY_CONSTANTS

  constructor(private fb: FormBuilder,
    private contactMessagesService: ContactMessagesService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.minLength(2)],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
      gdpr: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {

      const formData = this.contactForm.value;
      const message: ContactMessageModel = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        gdpr: formData.gdpr,
      }

      this.contactMessagesService.storeMessage(message).subscribe(response => {
        this.contactForm.reset();
        this.messageService.showSuccess(response.message);
      });

    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control.markAsTouched();
      });
    }
  }
}
