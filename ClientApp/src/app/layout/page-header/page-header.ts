import { Component, inject, input, output } from '@angular/core';
import { ToastService } from '../../pages/services/toast-service';
import { UserService } from '../../pages/services/user-service';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-page-header',
  styleUrl: './page-header.css',
  templateUrl: './page-header.html',
})
export class PageHeader {
  private toastService = inject(ToastService);
  private userService = inject(UserService);

  userData = this.userService.userData;

  title = input.required<string>();
  subtitle = input.required<string>();
  isReport = input<boolean>(false);
  exportReport = output<void>();

  onExportReport(): void {
    this.toastService.showSuccess("Download", "Report Downloaded Successfully!");
    this.exportReport.emit();
  }
}
