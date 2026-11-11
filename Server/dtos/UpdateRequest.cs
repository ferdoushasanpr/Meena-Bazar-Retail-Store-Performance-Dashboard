namespace Server.DTOs;

public class UpdateRequest
{
    public string user_id { get; set; } = null!;
    public string user_name { get; set; } = null!;
    public string user_email { get; set; } = null!;
    public string? updated_password { get; set; }
    public string? user_role { get; set; }
}
