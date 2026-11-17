namespace Server.DTOs;

public class NotificationResponse
{
    public string notification_id { get; set; } = null!;
    public string user_name { get; set; } = null!;
    public string message { get; set; } = null!;
    public int isRead { get; set; } = 0;
    public DateTime createdAt { get; set; }
}