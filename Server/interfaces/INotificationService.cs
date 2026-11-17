using Server.DTOs;
using Server.Models;
namespace Server.Interfaces;

public interface INotificationService
{
    Task<IEnumerable<NotificationResponse>> GetNotificatonsAsync();
    Task<bool> AddNotificationAsync(Notification notification);
    Task<bool> ReadNotificationAsync(NotificationResponse notification);
}