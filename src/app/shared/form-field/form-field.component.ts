import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface FormFieldOptions { value: string; label: string; icon: string };

@Component({
    selector: 'sb-form-field',
    imports: [CommonModule],
    templateUrl: './form-field.component.html',
    styleUrl: './form-field.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormFieldComponent),
            multi: true
        }
    ]
})
export class FormFieldComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() type: string = 'text';
    @Input() required: boolean = false;
    @Input() errorMessage: string = '';
    @Input() formatExample: string = '';
    @Input() size: 'sm' | 'md' | 'lg' = 'lg';
    @Input() control: AbstractControl | null = null;
    @Input() options: FormFieldOptions[] = []; // For select fields
    @Input() rows: number = 4; // For textarea

    value: any = '';
    disabled: boolean = false;
    dropdownOpen: boolean = false;

    private onChange = (value: any) => { };
    private onTouched = () => { };

    get isInvalid(): boolean {
        return !!(this.control && this.control.invalid && (this.control.dirty || this.control.touched));
    }

    get displayErrorMessage(): string {
        if (!this.isInvalid || !this.control) return '';

        if (this.errorMessage) return this.errorMessage;

        const errors = this.control.errors;
        const exampleText = this.formatExample ? `. Napr. '${this.formatExample}'` : '';

        if (errors?.['required']) return `${this.label} je povinné`;
        if (errors?.['email']) return `Zadajte platný email${exampleText}`;
        if (errors?.['minlength']) return `Minimálne ${errors['minlength'].requiredLength} znakov`;
        if (errors?.['pattern']) return `Neplatný formát${exampleText}`;

        return 'Neplatná hodnota';
    }

    get sizeClass(): string {
        switch (this.size) {
            case 'sm': return 'form-control-sm';
            case 'md': return '';
            case 'lg': return 'form-control-lg';
            default: return 'form-control-lg';
        }
    }

    get selectSizeClass(): string {
        switch (this.size) {
            case 'sm': return 'form-select-sm';
            case 'md': return '';
            case 'lg': return 'form-select-lg';
            default: return 'form-select-lg';
        }
    }

    toggleDropdown(): void {
        if (!this.disabled) {
            this.dropdownOpen = !this.dropdownOpen;
        }
    }

    selectOption(option: FormFieldOptions): void {
        this.value = option.value;
        this.onChange(option.value);
        this.onTouched();
        this.dropdownOpen = false;
    }

    getSelectedOption(): FormFieldOptions | undefined {
        return this.options.find(option => option.value === this.value);
    }

    onInput(event: any): void {
        const value = event.target.value;
        this.value = value;
        this.onChange(value);
    }

    onBlur(): void {
        this.onTouched();
        // Close dropdown when clicking outside
        setTimeout(() => {
            this.dropdownOpen = false;
        }, 150);
    }

    // ControlValueAccessor methods
    writeValue(value: any): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
