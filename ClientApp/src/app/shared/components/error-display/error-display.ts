import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-error-display',
  styleUrl: './error-display.css',
  templateUrl: './error-display.html',
})
export class ErrorDisplay {
  message = input<string>('');
  onLoad = output<void>();

  onLoadComponent(): void {
    this.onLoad.emit();
  }
}
