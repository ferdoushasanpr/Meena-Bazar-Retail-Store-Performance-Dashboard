using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interfaces;
using Server.Models;

class NotificationService : INotificationService
{
    private readonly ApplicationDbContext _context;

    public NotificationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Notification>> GetNotificatonsAsync()
    {
        var query = _context.DemoNotifications.AsNoTracking();
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

    public async Task<bool> ReadNotificationAsync(string notification_id)
    {
        var notification = await _context.DemoNotifications.FirstOrDefaultAsync(n => n.notification_id == notification_id);

        if (notification == null)
        {
            return false;
        }
        notification.isRead = 1;

        return await _context.SaveChangesAsync() > 0;
    }
}