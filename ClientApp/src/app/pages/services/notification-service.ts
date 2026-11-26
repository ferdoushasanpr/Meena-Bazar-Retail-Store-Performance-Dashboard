import { inject, Injectable, signal } from '@angular/core';
import { OperationsService } from '../../core/services/operations-service';
import { NotificationData, NotificationResponse } from '../../core/models/notification';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private operationService = inject(OperationsService);
    private hubConnection?: HubConnection;

    connectionStatus = signal<boolean>(false);

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

    markAsReadNotification(notification_id: string, notification: NotificationResponse) {
        return this.operationService.updateNotificationData(notification_id, notification);
    }

    // SignalR connection
    async startNotificationConnection(): Promise<void> {
        if (this.hubConnection) {
            return;
        }

        this.hubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5253/hubs/notifications')
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection.on(
            'ReceiveNotification',
            (notification: NotificationResponse) => {
                this.notifications.update(current => [
                    notification,
                    ...current
                ]);

                console.log('New notification received:', notification);
            }
        );

        this.hubConnection.onreconnecting(() => {
            this.connectionStatus.set(false);
        });

        this.hubConnection.onreconnected(() => {
            this.connectionStatus.set(true);
            this.getNotifications();
        });

        this.hubConnection.onclose(() => {
            this.connectionStatus.set(false);
        });

        try {
            await this.hubConnection.start();
            this.connectionStatus.set(true);
            console.log('SignalR connected successfully!');
        } catch (error) {
            console.error('SignalR connection failed:', error);
            this.connectionStatus.set(false);
        }
    }

    async stopNotificationConnection(): Promise<void> {
        if (this.hubConnection) {
            await this.hubConnection.stop();
            this.hubConnection = undefined;
            this.connectionStatus.set(false);
        }
    }
}
