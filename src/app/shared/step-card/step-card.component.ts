import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StepConfig {
  id: string;
  step: number;
  title: string;
  subtitle?: string;
  nextStep?: number;
  prevStep?: number;
  showBackButton: boolean;
  showActions: boolean;
  showEditIcon: boolean;
  disabled?: (currentStep: number) => boolean;
  nextDisabled?: () => boolean;
}

@Component({
  selector: 'sb-step-card',
  imports: [CommonModule],
  templateUrl: './step-card.component.html',
  styleUrl: './step-card.component.scss'
})
export class StepCardComponent {
  @Input() config!: StepConfig;
  @Input() currentStep: number = 1;
  @Input() nextButtonDisabled: boolean = false;

  @Output() stepClicked = new EventEmitter<number>();
  @Output() nextClicked = new EventEmitter<void>();
  @Output() backClicked = new EventEmitter<void>();

  get isActive(): boolean {
    return this.currentStep === this.config.step;
  }

  get isCompleted(): boolean {
    return this.currentStep > this.config.step;
  }

  get isDisabled(): boolean {
    return this.config.disabled ? this.config.disabled(this.currentStep) : false;
  }

  get showEditIcon(): boolean {
    return this.config.showEditIcon && this.isCompleted && !this.isActive;
  }

  onStepHeaderClick(): void {
    if (this.isCompleted && !this.isActive) {
      this.stepClicked.emit(this.config.step);
    }
  }

  onNextClick(): void {
    this.nextClicked.emit();
  }

  onBackClick(): void {
    this.backClicked.emit();
  }
}
