import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-page-header',
  styleUrl: './page-header.css',
  templateUrl: './page-header.html',
})
export class PageHeader {
  title = input.required<string>();
  subtitle = input.required<string>();
  exportReport = output<void>();

  onExportReport(): void {
    this.exportReport.emit();
  }
}
