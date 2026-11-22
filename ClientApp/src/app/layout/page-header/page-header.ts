import { Component, inject, input, output } from '@angular/core';
import { ToastService } from '../../pages/services/toast-service';

@Component({
  imports: [],
  selector: 'app-page-header',
  styleUrl: './page-header.css',
  templateUrl: './page-header.html',
})
export class PageHeader {
  private toastService = inject(ToastService);
  title = input.required<string>();
  subtitle = input.required<string>();
  exportReport = output<void>();

  onExportReport(): void {
    this.toastService.showSuccess("Download", "Report Downloaded Successfully!");
    this.exportReport.emit();
  }
}
