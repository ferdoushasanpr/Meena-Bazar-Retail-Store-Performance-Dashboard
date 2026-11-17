import { inject, Injectable } from '@angular/core';
import { OperationsService } from '../../core/services/operations-service';
import { NotificationData } from '../../core/models/notification';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private operationService = inject(OperationsService);

    addNotification(notification: NotificationData) {
        return this.operationService.addNotificationData(notification);
    }
}
