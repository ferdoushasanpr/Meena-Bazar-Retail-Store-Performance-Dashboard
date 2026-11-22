using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs;
using Server.Hubs;
using Server.Interfaces;
using Server.Models;

class NotificationService : INotificationService
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(IHubContext<NotificationHub> hubContext, ApplicationDbContext context)
    {
        _hubContext = hubContext;
        _context = context;
    }

    public async Task<IEnumerable<NotificationResponse>> GetNotificationsAsync()
    {
        try
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
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw;
        }
    }

    public async Task<bool> AddNotificationAsync(Notification notification)
    {
        try
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

            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
            {
                return false;
            }

            var notificationResponse = await (
            from n in _context.DemoNotifications.AsNoTracking()
            join u in _context.DemoUsers.AsNoTracking()
                on n.user_id equals u.user_id
            where n.notification_id == notification.notification_id
            select new NotificationResponse
            {
                notification_id = n.notification_id,
                user_name = u.user_name,
                message = n.message,
                isRead = n.isRead,
                createdAt = n.createdAt
            }).FirstOrDefaultAsync();

            if (notificationResponse != null)
            {
                await _hubContext.Clients.All.SendAsync(
                    "ReceiveNotification",
                    notificationResponse
                );
            }

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw;
        }
    }

    public async Task<bool> ReadNotificationAsync(NotificationResponse notification)
    {
        try
        {
            var existingNotification = await _context.DemoNotifications.FirstOrDefaultAsync(n => n.notification_id == notification.notification_id);

            if (existingNotification == null)
            {
                return false;
            }

            existingNotification.isRead = 1;

            return await _context.SaveChangesAsync() > 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw;
        }
    }
}