using Server.Models;
using Server.DTOs;

namespace Server.Interfaces;

public interface IUserService
{
    Task<PaginatedResponse<UserResponse>> GetAllUsersAsync(int pageNumber, int pageSize);
    Task<User?> GetUserByIdAsync(string user_id);
    Task<PaginatedResponse<User>> SearchUsersAsync(string? searchTerm, int pageNumber = 1, int pageSize = 10);
    Task<bool> AddUserAsync(User user);
    Task<bool> UpdateUserAsync(UpdateRequest user);
    Task<bool> DeleteUserAsync(string user_id);
}