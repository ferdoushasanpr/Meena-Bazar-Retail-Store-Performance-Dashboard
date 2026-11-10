namespace Server.DTOs;

public class AuthResponse
{
    public string Token { get; set; } = null!;
    public string UserId { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string UserEmail { get; set; } = null!;
    public string Role { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
}
