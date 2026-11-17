import { inject, Injectable, signal } from '@angular/core';
import { OperationsService } from '../../core/services/operations-service';
import { NotificationData, NotificationResponse } from '../../core/models/notification';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private operationService = inject(OperationsService);

    notificationsDataLoading = signal<boolean>(false);

    notifications = signal<NotificationResponse[]>([]);

    addNotification(notification: NotificationData) {
        return this.operationService.addNotificationData(notification);
    }

    getNotifications() {
        this.notificationsDataLoading.set(true);
        return this.operationService.getNotificationsData().subscribe({
            next: (response) => {
                this.notifications.set(response);
                this.notificationsDataLoading.set(false);
            },
            error: (error) => { console.error(error) }
        });
    }
}
