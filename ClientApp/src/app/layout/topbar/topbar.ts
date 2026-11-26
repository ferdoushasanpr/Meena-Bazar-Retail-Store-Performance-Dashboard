import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../auth/services/auth-service';
import { NotificationPanel } from '../../shared/components/notification-panel/notification-panel';
import { NotificationService } from '../../pages/services/notification-service';

@Component({
  imports: [RouterLink, TitleCasePipe, NotificationPanel],
  selector: 'app-topbar',
  styleUrl: './topbar.css',
  templateUrl: './topbar.html',
})
export class Topbar implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  // User Data
  authData = this.authService.authData;

  username = signal<string | null>(this.authData()!.userName);
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
    const token = this.authData()?.token;

    if (token) {
      this.notificationService.getNotifications(token);
      this.notificationService.startNotificationConnection(token);
    }
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
    const token = this.authData()?.token;

    if (!token) return;

    const data = this.notifications().find(item => item.notification_id === id);

    if (!data) return;

    this.notifications.update(arr => arr.map(item => item.notification_id === id ? { ...item, isRead: 1 } : item));

    this.notificationService.markAsReadNotification(token, id, data).subscribe({
      next: (response) => { console.log("The Notifications is Read.") },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
