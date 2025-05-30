import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent, FormFieldOptions } from '../../../shared/form-field/form-field.component';
import { PacketaAddressModel } from '../../../shared/packeta/models/PacketaAddressModel';
import { CountryModel } from '../../../models/CountryModel';
import { CountriesService } from '../../../services/countries.service';

@Component({
  selector: 'sb-cart-billing-details',
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './cart-billing-details.component.html',
  styleUrl: './cart-billing-details.component.scss'
})
export class CartBillingDetailsComponent implements OnInit {
  @Input() packetaShippingAddress: PacketaAddressModel;
  @Output() orderSubmitted = new EventEmitter<any>();

  orderForm!: FormGroup;

  countries: CountryModel[];
  countryOptions: FormFieldOptions[];
  countryPhoneOptions: FormFieldOptions[];

  constructor(private fb: FormBuilder,
    private countriesService: CountriesService,
  ) { }

  ngOnInit(): void {
    this.countriesService.fetchCountries().subscribe(countries => {
      this.countries = countries;
      this.countryOptions = countries.map(country => ({
        value: country.iso2,
        label: country.name,
        icon: 'fi fi-' + country.iso2.toLowerCase(),
      }));
      this.countryPhoneOptions = countries.map(country => ({
        value: country.iso2,
        label: '(' + country.phone_code + ')',
        icon: 'fi fi-' + country.iso2.toLowerCase(),
      }));
      this.initForm();
    });

  }
  //${addressObject?.street} ${addressObject?.houseNumber}, ${addressObject?.city} ${addressObject?.postcode}
  private initForm(): void {
    this.orderForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      isCompany: [false],
      companyName: [''],
      ico: ['', [Validators.pattern(/^\d{8}$/)]],
      dic: ['', [Validators.pattern(/^\d{10}$/)]],
      icdph: ['', [Validators.pattern(/^[A-Z]{2}\d{10}$/)]],
      street: [this.setStreetFromPacketa(), [Validators.required]],
      postalCode: [this.packetaShippingAddress?.postcode ? this.packetaShippingAddress?.postcode : '', [Validators.required, Validators.pattern(/^\d{3}\s?\d{2}$/)]],
      city: [this.packetaShippingAddress?.city ? this.packetaShippingAddress?.city : '', [Validators.required]],
      country: [this.packetaShippingAddress?.country ? this.packetaShippingAddress?.country : 'SK', [Validators.required]],
      phonePrefixCountryCode: [this.setPhonePrefixCountryCode()],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      differentShipping: [false],
      shippingAddress: this.fb.group({
        firstName: [''],
        lastName: [''],
        companyName: [''],
        street: [this.setStreetFromPacketa()],
        postalCode: [this.packetaShippingAddress?.postcode ? this.packetaShippingAddress?.postcode : ''],
        city: [this.packetaShippingAddress?.city ? this.packetaShippingAddress?.city : ''],
        country: [this.packetaShippingAddress?.country ? this.packetaShippingAddress?.country : 'SK']
      }),
      notes: [''],
      acceptTerms: [false, [Validators.requiredTrue]],
      newsletter: [false]
    });

    // Fill with test data for development
    //this.fillTestData();

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
        shippingGroup.get('postalCode')?.setValidators([Validators.required, Validators.pattern(/^\d{3}\s?\d{2}$/)]);
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

  private setStreetFromPacketa(): string {
    if (this.packetaShippingAddress) {
      const street = this.packetaShippingAddress.street || '';
      const houseNumber = this.packetaShippingAddress.houseNumber || '';

      if (street && houseNumber) {
        return `${street} ${houseNumber}`;
      } else if (street) {
        return street;
      } else if (houseNumber) {
        return houseNumber;
      }
    }
    return '';
  }

  private setPhonePrefixCountryCode(): string {
    if (this.packetaShippingAddress && this.packetaShippingAddress.country) {
      const country = this.countries.find(c => c.iso2.toLowerCase() === this.packetaShippingAddress.country.toLowerCase());
      return country ? country.iso2 : '';
    }
    const country = this.countries.find(c => c.iso2 === 'SK');
    return country ? country.iso2 : '';
  }

  private fillTestData(): void {
    this.orderForm.patchValue({
      firstName: 'Viliam',
      lastName: 'Zemeš',
      isCompany: true,
      companyName: 'Testovacia s.r.o.',
      ico: '12345678',
      dic: '1234567890',
      icdph: 'SK1234567890',
      street: this.setStreetFromPacketa() || 'Kvetoslavov 123',
      postalCode: this.packetaShippingAddress?.postcode ? this.packetaShippingAddress?.postcode : '12345',
      city: this.packetaShippingAddress?.city ? this.packetaShippingAddress?.city : 'Krakow',
      country: this.packetaShippingAddress?.country ? this.packetaShippingAddress?.country : 'SK',
      phone: '123456789',
      email: 'vilizemes@gmail.com',
      differentShipping: true,
      shippingAddress: {
        firstName: 'Branislav',
        lastName: 'Mojsej',
        companyName: 'Technokrat s.r.o.',
        street: this.setStreetFromPacketa() || 'Hlavná 123',
        postalCode: this.packetaShippingAddress?.postcode ? this.packetaShippingAddress?.postcode : '920 45',
        city: this.packetaShippingAddress?.city ? this.packetaShippingAddress?.city : 'Monako',
        country: this.packetaShippingAddress?.country ? this.packetaShippingAddress?.country : 'SK'
      },
      notes: 'Prosím si to doručiť do 3 dní.',
      acceptTerms: true,
      newsletter: true
    });
  }

  public onSubmit(): void {
    console.log('Submitting order form:', this.orderForm);
    if (this.orderForm.valid) {
      let formData = this.orderForm.value;

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

      const country = this.countries.find(c => c.iso2.toLowerCase() === formData.phonePrefixCountryCode.toLowerCase());
      formData.phone = `${country?.phone_code}${formData.phone}`;
      delete formData.phonePrefixCountryCode;

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
