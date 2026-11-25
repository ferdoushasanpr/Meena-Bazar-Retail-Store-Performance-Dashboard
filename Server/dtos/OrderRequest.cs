namespace Server.DTOs;

public class OrderRequest
{
    public string order_id { get; set; } = null!;
    public string store_id { get; set; } = null!;
    public string? customer_id { get; set; }
    public string order_channel { get; set; } = null!;
    public string payment_method { get; set; } = null!;
    public string order_status { get; set; } = null!;
}