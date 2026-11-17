import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { NotificationResponse } from '../../../core/models/notification';

@Component({
  imports: [CommonModule],
  selector: 'app-notification-panel',
  styleUrl: './notification-panel.css',
  templateUrl: './notification-panel.html',
})
export class NotificationPanel {
  isOpen = input<boolean>(false);
  notifications = input<NotificationResponse[]>([]);

  closePanel = output<void>();
  markAsRead = output<string | number>();

  unreadCount = computed(() =>
    this.notifications().filter((item) => !item.isRead).length
  );

  onItemClick(item: NotificationResponse): void {
    if (!item.isRead) {
      this.markAsRead.emit(item.notification_id);
    }
  }

  onClose(): void {
    this.closePanel.emit();
  }
}
