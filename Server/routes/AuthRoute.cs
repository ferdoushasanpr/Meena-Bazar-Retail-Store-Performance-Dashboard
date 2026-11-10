using Microsoft.AspNetCore.Mvc;
using Server.DTOs;
using Server.Interfaces;

namespace Server.Routes;

public static class AuthRoute
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth")
            .WithTags("Auth");

        group.MapPost("/register", async (
            [FromBody] RegisterRequest request,
            IAuthService authService) =>
        {
            if (string.IsNullOrWhiteSpace(request.user_name) ||
                string.IsNullOrWhiteSpace(request.user_email) ||
                string.IsNullOrWhiteSpace(request.password))
            {
                return Results.BadRequest(new
                {
                    message = "All fields are required."
                });
            }

            var result = await authService.RegisterAsync(request);

            if (result == null)
            {
                return Results.Conflict(new
                {
                    message = "Email already exists."
                });
            }

            return Results.Ok(new
            {
                message = "Registration successful.",
                data = result
            });
        });

        group.MapPost("/login", async ([FromBody] LoginRequest request, IAuthService service) =>
        {
            if (string.IsNullOrWhiteSpace(request.user_email) ||
                string.IsNullOrWhiteSpace(request.password))
            {
                return Results.BadRequest(new
                {
                    message = "Email and Password are required."
                });
            }

            var result = await service.LoginAsync(request);

            if (result == null)
            {
                return Results.Unauthorized();
            }

            return Results.Ok(new
            {
                message = "Login successful.",
                data = result
            });
        });

        return app;
    }
}