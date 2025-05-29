import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sb-progress-header',
  imports: [CommonModule],
  templateUrl: './progress-header.component.html',
  styleUrl: './progress-header.component.scss'
})
export class ProgressHeaderComponent {
  @Input() currentStep: number = 1;
  @Input() totalSteps: number = 3;
  @Input() showStepDots: boolean = true;
  @Input() showProgressBar: boolean = true;
  @Input() stepText: string = 'Krok';

  getStepsArray(): number[] {
    return Array.from({ length: this.totalSteps }, (_, i) => i + 1);
  }
}
