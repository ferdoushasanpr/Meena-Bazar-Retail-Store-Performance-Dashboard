namespace Server.Models;

public class User
{
    public string user_id { get; set; } = null!;
    public string user_name { get; set; } = null!;
    public string user_email { get; set; } = null!;
    public string user_password_hash { get; set; } = null!;
    public string user_role { get; set; } = "user";
    public DateTime user_signup { get; set; }
}