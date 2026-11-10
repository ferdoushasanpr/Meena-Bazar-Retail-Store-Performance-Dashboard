namespace Server.DTOs;

public class UserResponse
{
    public string user_id { get; set; } = null!;
    public string user_name { get; set; } = null!;
    public string user_email { get; set; } = null!;
    public string user_role { get; set; } = null!;
    public DateTime user_signup { get; set; }
}