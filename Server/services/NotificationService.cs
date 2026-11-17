using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs;
using Server.Interfaces;
using Server.Models;

class NotificationService : INotificationService
{
    private readonly ApplicationDbContext _context;

    public NotificationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<NotificationResponse>> GetNotificatonsAsync()
    {
        var query = from n in _context.DemoNotifications.AsNoTracking()
                    join u in _context.DemoUsers.AsNoTracking()
                    on n.user_id equals u.user_id
                    select new NotificationResponse
                    {
                        notification_id = n.notification_id,
                        user_name = u.user_name,
                        message = n.message,
                        isRead = n.isRead,
                        createdAt = n.createdAt
                    };
        return await query.OrderByDescending(n => n.notification_id).Take(20).ToListAsync();
    }

    public async Task<bool> AddNotificationAsync(Notification notification)
    {
        var lastNotification = await _context.DemoNotifications.OrderByDescending(n => n.notification_id).FirstOrDefaultAsync();
        int nextId = 1;

        if (lastNotification != null)
        {
            nextId = int.Parse(lastNotification.notification_id.Substring(1)) + 1;
        }

        notification.notification_id = $"N{nextId:D4}";
        notification.createdAt = DateTime.UtcNow;

        await _context.DemoNotifications.AddAsync(notification);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> ReadNotificationAsync(NotificationResponse notification)
    {
        var existingNotification = await _context.DemoNotifications.FirstOrDefaultAsync(n => n.notification_id == notification.notification_id);

        if (existingNotification == null)
        {
            return false;
        }

        existingNotification.isRead = 1;

        return await _context.SaveChangesAsync() > 0;
    }
}