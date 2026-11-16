using Server.Models;
namespace Server.Interfaces;

public interface INotificationService
{
    Task<IEnumerable<Notification>> GetNotificatonsAsync();
    Task<bool> AddNotificationAsync(Notification notification);
    Task<bool> ReadNotificationAsync(string notification_id);
}