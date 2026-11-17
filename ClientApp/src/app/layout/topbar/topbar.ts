import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../auth/services/auth-service';
import { NotificationPanel } from '../../shared/components/notification-panel/notification-panel';
import { NotificationService } from '../../pages/services/notification-service';

export interface NotificationItem {
  id: string | number;
  title: string;
  message: string;
  time: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

@Component({
  imports: [RouterLink, TitleCasePipe, NotificationPanel],
  selector: 'app-topbar',
  styleUrl: './topbar.css',
  templateUrl: './topbar.html',
})
export class Topbar implements OnInit {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  lastUpdatedTime: string = '10:42 AM';

  private router = inject(Router);
  pathSegments = signal<string[]>([]);

  isNotificationsOpen = signal<boolean>(false);
  notifications = this.notificationService.notifications;

  constructor() {
    this.updatePath();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updatePath());
  }

  ngOnInit(): void {
    this.notificationService.getNotifications();
    this.notificationService.startNotificationConnection();
  }

  updatePath() {
    const segments = this.router.url
      .split('?')[0]
      .split('/')
      .filter(Boolean);

    this.pathSegments.set(segments);
  }

  toggleNotifications(): void {
    this.isNotificationsOpen.update((open) => !open);
  }

  updateMarkAsRead(id: string): void {
    const data = this.notifications().find(item => item.notification_id === id);
    if (data) {
      data.isRead = 1;
      this.notificationService.markAsReadNotification(id, data).subscribe({
        next: (response) => { console.log("The Notifications is Read.") },
        error: (error) => {
          console.error(error);
        }
      })
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}
