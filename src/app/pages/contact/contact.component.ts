import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'sb-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      gdpr: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      // Here you would typically send the form data to a backend service
      alert('Správa bola úspešne odoslaná. Ďakujeme!');
      this.contactForm.reset();
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control.markAsTouched();
      });
    }
  }
}
