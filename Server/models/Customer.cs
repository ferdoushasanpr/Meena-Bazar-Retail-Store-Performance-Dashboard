namespace Server.Models;

public class Customer
{
    public string customer_id { get; set; } = null!;
    public string first_name { get; set; } = null!;
    public string last_name { get; set; } = null!;
    public string email { get; set; } = null!;
    public string city { get; set; } = null!;
    public DateTime signup_date { get; set; }
    public string loyalty_tier { get; set; } = null!;
    public string customer_segment { get; set; } = null!;
}