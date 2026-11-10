namespace Server.DTOs;

public class LoginRequest
{
    public string user_email { get; set; } = null!;
    public string password { get; set; } = null!;
}
