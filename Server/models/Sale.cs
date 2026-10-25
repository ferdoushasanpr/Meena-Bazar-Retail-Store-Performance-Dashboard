namespace Server.Models;

public class Sale
{
    public string order_id { get; set; } = null!;
    public DateTime order_datetime { get; set; }
    public string store_id { get; set; } = null!;
    public string? customer_id { get; set; }
    public string order_channel { get; set; } = null!;
    public string payment_method { get; set; } = null!;
    public string order_status { get; set; } = null!;
    public double subtotal { get; set; }
    public double discount_total { get; set; }
    public double vat_total { get; set; }
    public double delivery_fee { get; set; }
    public double total_amount { get; set; }
}