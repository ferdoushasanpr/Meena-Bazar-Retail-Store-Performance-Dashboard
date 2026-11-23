using Server.Models;
using Server.Interfaces;
using Server.Data;
using Microsoft.EntityFrameworkCore;
using Server.DTOs;
using Microsoft.AspNetCore.Identity;
using NLog;

namespace Server.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly Logger logger = LogManager.GetCurrentClassLogger();

    public UserService(ApplicationDbContext context)
    {
        _context = context;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<PaginatedResponse<UserResponse>> GetAllUsersAsync(int pageNumber, int pageSize)
    {
        try
        {
            var query = _context.DemoUsers.AsNoTracking();
            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            var users = await query.Select(u => new UserResponse
            {
                user_id = u.user_id,
                user_name = u.user_name,
                user_email = u.user_email,
                user_role = u.user_role,
                user_signup = u.user_signup
            }).OrderByDescending(u => u.user_id).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PaginatedResponse<UserResponse>
            {
                Data = users,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = totalPages
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all users. PageNumber: {PageNumber}, PageSize: {PageSize}");
            throw;
        }
    }

    public async Task<User?> GetUserByIdAsync(string user_id)
    {
        try
        {
            return await _context.DemoUsers.AsNoTracking().FirstOrDefaultAsync(u => u.user_id == user_id);
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to retrieve user. User_Id: {User_Id}",
                user_id);
            throw;
        }
    }
    public async Task<PaginatedResponse<UserResponse>> SearchUsersAsync(string? searchTerm, int pageNumber = 1, int pageSize = 10)
    {
        try
        {
            var query = _context.DemoUsers.AsNoTracking();
            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(u =>
                    u.user_id.Contains(searchTerm) ||
                    u.user_name.Contains(searchTerm) ||
                    u.user_email.Contains(searchTerm) ||
                    u.user_role.Contains(searchTerm) ||
                    u.user_signup.ToString().Contains(searchTerm)
                );
            }

            var users = await query.Select(u => new UserResponse
            {
                user_id = u.user_id,
                user_name = u.user_name,
                user_email = u.user_email,
                user_role = u.user_role,
                user_signup = u.user_signup
            }).OrderByDescending(u => u.user_id).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PaginatedResponse<UserResponse>
            {
                Data = users,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = totalPages
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to search users. SearchTerm: {SearchTerm}",
                searchTerm);
            throw;
        }
    }
    public async Task<bool> AddUserAsync(User user)
    {
        try
        {
            var lastUser = await _context.DemoUsers.OrderByDescending(u => u.user_id).FirstOrDefaultAsync();

            if (string.IsNullOrWhiteSpace(user.user_email) ||
                        string.IsNullOrWhiteSpace(user.user_password_hash))
            {
                return false;
            }

            bool exists = await _context.DemoUsers.AnyAsync(u =>
                u.user_email == user.user_email);

            if (exists)
                return false;

            int nextId = 1;

            if (lastUser != null)
            {
                nextId = int.Parse(lastUser.user_id.Substring(4)) + 1;
            }

            user.user_id = $"U{nextId:D5}";
            user.user_signup = DateTime.UtcNow;

            if (string.IsNullOrWhiteSpace(user.user_role))
                user.user_role = "user";

            _context.DemoUsers.Add(user);
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
                logger.Info("User created successfully.");

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to create user.");
            throw;
        }
    }
    public async Task<bool> UpdateUserAsync(UpdateRequest user)
    {
        try
        {
            var existingUser = await _context.DemoUsers
                        .FirstOrDefaultAsync(u => u.user_id == user.user_id);

            if (existingUser == null)
                return false;

            bool emailExists = await _context.DemoUsers.AnyAsync(u =>
                u.user_email == user.user_email &&
                u.user_id != user.user_id);

            if (emailExists)
                return false;

            existingUser.user_name = user.user_name;
            existingUser.user_email = user.user_email;

            if (user.user_role != null)
                existingUser.user_role = user.user_role;

            if (!string.IsNullOrWhiteSpace(user.updated_password))
            {
                existingUser.user_password_hash = _passwordHasher.HashPassword(existingUser, user.updated_password);
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("User updated successfully. User_Id: {User_Id}", user.user_id);
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to update user. User_Id: {User_Id}", user.user_id);
            throw;
        }
    }
    public async Task<bool> DeleteUserAsync(string user_id)
    {
        try
        {
            var user = await _context.DemoUsers.FirstOrDefaultAsync(u => u.user_id == user_id);

            if (user == null)
                return false;

            _context.DemoUsers.Remove(user);
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("User deleted successfully. User_Id: {User_Id}", user.user_id);
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to delete user. User_Id: {User_Id}", user_id);
            throw;
        }
    }
}