export interface NotificationData {
    user_id: string,
    message: string,
    isRead: number
}

export interface NotificationResponse {
    notification_id: string,
    user_name: string,
    message: string,
    isRead: number,
    createdAt: string
}