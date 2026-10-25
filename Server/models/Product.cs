namespace Server.Models;

public class Product
{
    public string product_id { get; set; } = null!;
    public string product_name { get; set; } = null!;
    public string category { get; set; } = null!;
    public string brand { get; set; } = null!;
    public double unit_cost { get; set; }
    public double unit_price { get; set; }
    public double vat_rate { get; set; }
}