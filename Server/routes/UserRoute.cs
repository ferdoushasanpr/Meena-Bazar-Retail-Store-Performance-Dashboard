using Microsoft.AspNetCore.Mvc;
using NLog;
using Server.DTOs;
using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class UserRoute
{
    public static readonly Logger logger = LogManager.GetCurrentClassLogger();
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
                    return Results.BadRequest("Invalid pagination parameters.");

                var isAdmin = context.User.IsInRole("admin");

                if (!isAdmin)
                {
                    return Results.Forbid();
                }

                var users = await userService.GetAllUsersAsync(
                    pageNumber, pageSize);

                logger.Info("Retrieved users. PageNumber: {PageNumber}, PageSize: {PageSize}, TotalRecords: {TotalRecords}", pageNumber, pageSize, users.TotalRecords);
                return Results.Ok(users);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve all users.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/{user_id}", async (string user_id, IUserService userService, HttpContext context) =>
        {
            try
            {
                var currentUserId = context.User.FindFirst(
                    System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                var isAdmin = context.User.IsInRole("admin");

                var user = await userService.GetUserByIdAsync(user_id);

                if (user == null)
                {
                    logger.Warn("No user found. User_Id: {User_Id}", user_id);
                    return Results.NotFound("User not found.");
                }

                if (!isAdmin && currentUserId != user.user_id)
                    return Results.Forbid();

                logger.Info("Retrieved user successfully. {User_Id}", user_id);
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
                logger.Error(ex, "Something went wrong to retrieve user. User_Id: {User_Id}", user_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/search", async (
            HttpContext context, IUserService userService, string? searchTerm, int pageNumber = 1, int pageSize = 10) =>
        {
            try
            {
                var isAdmin = context.User.IsInRole("admin");

                if (!isAdmin)
                    return Results.Json(new { message = "Access Denied." }, statusCode: StatusCodes.Status403Forbidden);

                if (pageNumber < 1 || pageSize < 1 || pageSize > 100)
                    return Results.BadRequest("Invalid pagination parameters.");

                var result = await userService.SearchUsersAsync(searchTerm, pageNumber, pageSize);

                logger.Info("Retrieved search users successfully with SearchTerm: {SearchTerm}", searchTerm);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to search user with SearchTerm: {SearchTerm}", searchTerm);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
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
                    return Results.BadRequest("User ID mismatch.");

                var currentUserId = context.User.FindFirst(
                    System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                var isAdmin = context.User.IsInRole("admin");

                if (!isAdmin && currentUserId != user_id)
                    return Results.Forbid();

                var existingUser = await userService.GetUserByIdAsync(user_id);

                if (existingUser == null)
                    return Results.NotFound("User not found.");

                if (!isAdmin)
                    request.user_role = existingUser.user_role;

                var result = await userService.UpdateUserAsync(request);

                if (!result)
                {
                    logger.Warn("User not found. User_Id: {User_Id}", user_id);
                    return Results.Conflict("Unable to update user. Email may already exist.");
                }

                return Results.Ok(new
                {
                    message = "User updated successfully."
                });
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to update user. User_Id: {User_Id}", user_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500); ;
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
                    return Results.Json(new { message = "Access Denied." }, statusCode: StatusCodes.Status403Forbidden);

                var result = await userService.DeleteUserAsync(user_id);

                if (!result)
                {
                    logger.Warn("User not found. User_Id: {User_Id}", user_id);
                    return Results.NotFound("User not found.");
                }

                return Results.Ok(new
                {
                    message = "User deleted successfully."
                });
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to delete user. User_Id: {User_Id}", user_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        return app;
    }
}