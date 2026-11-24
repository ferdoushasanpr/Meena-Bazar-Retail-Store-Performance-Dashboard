using Microsoft.AspNetCore.Mvc;
using NLog;
using Server.DTOs;
using Server.Interfaces;
using Server.Models;

public static class NotificationRoute
{
    public static readonly Logger logger = LogManager.GetCurrentClassLogger();
    public static IEndpointRouteBuilder MapNotificationsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("notifications").WithTags("Notifications").RequireAuthorization();

        group.MapGet("/", async (INotificationService service) =>
        {
            var results = await service.GetNotificationsAsync();

            logger.Info("Retrieved notifications successfully.");
            return Results.Ok(results);
        });

        group.MapPost("/", async (INotificationService service, [FromBody] Notification notification) =>
        {
            var result = await service.AddNotificationAsync(notification);

            if (!result)
            {
                logger.Warn("Notification not created.");
                return Results.BadRequest();
            }

            return Results.Ok("Successfully Created Notification.");
        });

        group.MapPut("/{notification_id}", async (INotificationService service, string notification_id, NotificationResponse notification) =>
        {
            if (notification.notification_id != notification_id)
            {
                return Results.BadRequest("Notification ID Mismatched!");
            }

            var result = await service.ReadNotificationAsync(notification);

            if (!result)
            {
                logger.Warn("Notification not found. Notifications_Id: {Notifications_Id}", notification_id);
                return Results.NotFound("No Notification Found.");
            }

            return Results.Ok("Successfully Read Notification.");
        });

        return app;
    }
}