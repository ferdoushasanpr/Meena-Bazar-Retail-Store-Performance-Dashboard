namespace Server.Models;

class Transaction
{
    public string order_item_id { get; set; } = null!;
    public string order_id { get; set; } = null!;
    public string product_id { get; set; } = null!;
    public byte quantity { get; set; }
    public double unit_price { get; set; }
    public double discount_amount { get; set; }
    public double line_net_amount { get; set; }
    public double line_vat_amount { get; set; }
}