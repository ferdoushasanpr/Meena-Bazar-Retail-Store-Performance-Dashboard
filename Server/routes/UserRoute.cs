using Microsoft.AspNetCore.Mvc;
using Server.DTOs;
using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class UserRoute
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/users")
            .WithTags("Users")
            .RequireAuthorization();

        group.MapGet("/", async (
        IUserService userService, HttpContext context, int pageNumber = 1, int pageSize = 10) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1 || pageSize > 100)
                {
                    return Results.BadRequest(new
                    {
                        message = "Invalid pagination parameters."
                    });
                }

                var isAdmin = context.User.IsInRole("admin");

                if (!isAdmin)
                {
                    return Results.Forbid();
                }

                var result = await userService.GetAllUsersAsync(
                    pageNumber, pageSize);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/{user_id}", async (string user_id, IUserService userService, HttpContext context) =>
        {
            try
            {
                var user = await userService.GetUserByIdAsync(user_id);

                if (user == null)
                {
                    return Results.NotFound(new
                    {
                        message = "User not found."
                    });
                }

                var currentUserId = context.User.FindFirst(
                    System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                var isAdmin = context.User.IsInRole("admin");

                if (!isAdmin && currentUserId != user.user_id)
                {
                    return Results.Forbid();
                }

                return Results.Ok(new
                {
                    user.user_id,
                    user.user_name,
                    user.user_email,
                    user.user_password_hash,
                    user.user_role,
                    user.user_signup
                });
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/search", async (
            HttpContext context, IUserService userService, string? searchTerm, int pageNumber = 1, int pageSize = 10) =>
        {
            try
            {
                var isAdmin = context.User.IsInRole("admin");

                if (!isAdmin)
                {
                    return Results.Json(new { message = "Access Denied." }, statusCode: StatusCodes.Status403Forbidden);
                }

                if (pageNumber < 1 || pageSize < 1 || pageSize > 100)
                {
                    return Results.BadRequest(new
                    {
                        message = "Invalid pagination parameters."
                    });
                }

                var result = await userService.SearchUsersAsync(searchTerm, pageNumber, pageSize);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapPut("/{user_id}", async (
            string user_id,
            [FromBody] UpdateRequest request,
            IUserService userService,
            HttpContext context) =>
        {
            try
            {
                if (user_id != request.user_id)
                {
                    return Results.BadRequest(new
                    {
                        message = "User ID mismatch."
                    });
                }

                var currentUserId = context.User.FindFirst(
                    System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                var isAdmin = context.User.IsInRole("admin");

                if (!isAdmin && currentUserId != user_id)
                {
                    return Results.Forbid();
                }

                var existingUser = await userService.GetUserByIdAsync(user_id);

                if (existingUser == null)
                {
                    return Results.NotFound(new
                    {
                        message = "User not found."
                    });
                }

                if (!isAdmin)
                {
                    request.user_role = existingUser.user_role;
                }

                var result = await userService.UpdateUserAsync(request);

                if (!result)
                {
                    return Results.Conflict(new
                    {
                        message = "Unable to update user. Email may already exist."
                    });
                }

                return Results.Ok(new
                {
                    message = "User updated successfully."
                });
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapDelete("/{user_id}", async (
            HttpContext context,
            string user_id,
            IUserService userService) =>
        {
            try
            {
                var isAdmin = context.User.IsInRole("admin");
                if (!isAdmin)
                {
                    return Results.Json(new { message = "Access Denied." }, statusCode: StatusCodes.Status403Forbidden);
                }

                var result = await userService.DeleteUserAsync(user_id);

                if (!result)
                {
                    return Results.NotFound(new
                    {
                        message = "User not found."
                    });
                }

                return Results.Ok(new
                {
                    message = "User deleted successfully."
                });
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        return app;
    }
}