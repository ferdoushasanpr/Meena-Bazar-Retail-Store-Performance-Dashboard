namespace Server.DTOs;

public class RegisterRequest
{
    public string user_name { get; set; } = null!;
    public string user_email { get; set; } = null!;
    public string password { get; set; } = null!;
}
