using Microsoft.AspNetCore.Mvc;
using Server.DTOs;
using Server.Interfaces;
using Server.Models;

public static class NotificationRoute
{
    public static IEndpointRouteBuilder MapNotificationsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("notifications").WithTags("Notifications");

        group.MapGet("/", async (INotificationService service) =>
        {
            try
            {
                var results = await service.GetNotificationsAsync();
                return Results.Ok(results);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 200);
            }
        });

        group.MapPost("/", async (INotificationService service, [FromBody] Notification notification) =>
        {
            try
            {
                var result = await service.AddNotificationAsync(notification);
                return result ? Results.Ok("Successfully Created Notification.") : Results.BadRequest();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 200);
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
                return result ? Results.Ok("Successfully Read Notification.") : Results.NotFound();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 200);
            }
        });

        return app;
    }
}