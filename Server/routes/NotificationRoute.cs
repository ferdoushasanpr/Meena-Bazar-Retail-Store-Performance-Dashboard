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
        var group = app.MapGroup("notifications").WithTags("Notifications");

        group.MapGet("/", async (INotificationService service) =>
        {
            try
            {
                var results = await service.GetNotificationsAsync();

                logger.Info("Retrieved notifications successfully.");
                return Results.Ok(results);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve all notifications.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapPost("/", async (INotificationService service, [FromBody] Notification notification) =>
        {
            try
            {
                var result = await service.AddNotificationAsync(notification);

                if (!result)
                {
                    logger.Warn("Notification not created.");
                    return Results.BadRequest();
                }

                return Results.Ok("Successfully Created Notification.");
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to create notification.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapPut("/{notification_id}", async (INotificationService service, string notification_id, NotificationResponse notification) =>
        {
            try
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
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to update notification. Notification_Id: {Notification_Id}", notification_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        return app;
    }
}