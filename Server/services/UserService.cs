using Server.Models;
using Server.Interfaces;
using Server.Data;
using Microsoft.EntityFrameworkCore;
using Server.DTOs;
using Microsoft.AspNetCore.Identity;

namespace Server.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<PaginatedResponse<UserResponse>> GetAllUsersAsync(int pageNumber, int pageSize)
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

    public async Task<User?> GetUserByIdAsync(string user_id)
    {
        return await _context.DemoUsers.AsNoTracking().FirstOrDefaultAsync(u => u.user_id == user_id);
    }
    public async Task<PaginatedResponse<User>> SearchUsersAsync(string? searchTerm, int pageNumber = 1, int pageSize = 10)
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

        var users = await query.OrderByDescending(u => u.user_id).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PaginatedResponse<User>
        {
            Data = users,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalRecords = totalRecords,
            TotalPages = totalPages
        };
    }
    public async Task<bool> AddUserAsync(User user)
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

        return await _context.SaveChangesAsync() > 0;
    }
    public async Task<bool> UpdateUserAsync(UpdateRequest user)
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

        return await _context.SaveChangesAsync() > 0;
    }
    public async Task<bool> DeleteUserAsync(string user_id)
    {
        var user = await _context.DemoUsers.FirstOrDefaultAsync(u => u.user_id == user_id);

        if (user == null)
            return false;

        _context.DemoUsers.Remove(user);

        return await _context.SaveChangesAsync() > 0;
    }
}