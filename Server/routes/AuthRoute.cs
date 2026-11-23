using Microsoft.AspNetCore.Mvc;
using NLog;
using Server.DTOs;
using Server.Interfaces;

namespace Server.Routes;

public static class AuthRoute
{
    public static readonly Logger logger = LogManager.GetCurrentClassLogger();
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth")
            .WithTags("Auth");

        group.MapPost("/register", async (
            [FromBody] RegisterRequest request,
            IAuthService authService) =>
        {
            try
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
                    logger.Warn("User not registered.");
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
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to register user.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapPost("/login", async ([FromBody] LoginRequest request, IAuthService service) =>
        {
            try
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
                    logger.Warn("User not login.");
                    return Results.Unauthorized();
                }

                return Results.Ok(new
                {
                    message = "Login successful.",
                    data = result
                });
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to login user.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        return app;
    }
}