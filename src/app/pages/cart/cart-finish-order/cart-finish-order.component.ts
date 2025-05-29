import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sb-cart-finish-order',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cart-finish-order.component.html',
  styleUrl: './cart-finish-order.component.scss'
})
export class CartFinishOrderComponent implements OnInit {
  @Output() orderSubmitted = new EventEmitter<any>();

  orderForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      isCompany: [false],
      companyName: [''],
      ico: [''],
      dic: [''],
      icdph: [''],
      street: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      city: ['', [Validators.required]],
      country: ['SK', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+421|0)[0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      differentShipping: [false],
      shippingAddress: this.fb.group({
        firstName: [''],
        lastName: [''],
        companyName: [''],
        street: [''],
        postalCode: [''],
        city: [''],
        country: ['SK']
      }),
      notes: [''],
      acceptTerms: [false, [Validators.requiredTrue]],
      newsletter: [false]
    });

    // Add conditional validators
    this.orderForm.get('isCompany')?.valueChanges.subscribe(isCompany => {
      const companyNameControl = this.orderForm.get('companyName');
      const icoControl = this.orderForm.get('ico');
      
      if (isCompany) {
        companyNameControl?.setValidators([Validators.required]);
        icoControl?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]);
      } else {
        companyNameControl?.clearValidators();
        icoControl?.clearValidators();
      }
      
      companyNameControl?.updateValueAndValidity();
      icoControl?.updateValueAndValidity();
    });

    this.orderForm.get('differentShipping')?.valueChanges.subscribe(differentShipping => {
      const shippingGroup = this.orderForm.get('shippingAddress') as FormGroup;
      
      if (differentShipping) {
        shippingGroup.get('firstName')?.setValidators([Validators.required]);
        shippingGroup.get('lastName')?.setValidators([Validators.required]);
        shippingGroup.get('street')?.setValidators([Validators.required]);
        shippingGroup.get('postalCode')?.setValidators([Validators.required, Validators.pattern(/^\d{5}$/)]);
        shippingGroup.get('city')?.setValidators([Validators.required]);
      } else {
        Object.keys(shippingGroup.controls).forEach(key => {
          shippingGroup.get(key)?.clearValidators();
        });
      }
      
      Object.keys(shippingGroup.controls).forEach(key => {
        shippingGroup.get(key)?.updateValueAndValidity();
      });
    });
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const formData = this.orderForm.value;
      
      // Clean up shipping address if not needed
      if (!formData.differentShipping) {
        delete formData.shippingAddress;
      }
      
      // Clean up company fields if not a company
      if (!formData.isCompany) {
        delete formData.companyName;
        delete formData.ico;
        delete formData.dic;
        delete formData.icdph;
      }
      
      this.orderSubmitted.emit(formData);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.orderForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isShippingFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(`shippingAddress.${fieldName}`);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
