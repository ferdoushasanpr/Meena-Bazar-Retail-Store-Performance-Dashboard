using Microsoft.AspNetCore.Mvc;
using Server.Interfaces;
using Server.Models;

public static class NotificationRoute
{
    public static IEndpointRouteBuilder MapNotificationsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("notifications").WithTags("Notifications");

        group.MapGet("/", async (INotificationService service) =>
        {
            var results = await service.GetNotificatonsAsync();
            return Results.Ok(results);
        });

        group.MapPost("/", async (INotificationService service, [FromBody] Notification notification) =>
        {
            var result = await service.AddNotificationAsync(notification);
            return result ? Results.Ok("Successfully Created Notification.") : Results.BadRequest();
        });

        group.MapPut("/{notification_id}", async (INotificationService service, string notification_id) =>
        {
            var result = await service.ReadNotificationAsync(notification_id);
            return result ? Results.Ok("Successfully Read Notification.") : Results.NotFound();
        });

        return app;
    }
}