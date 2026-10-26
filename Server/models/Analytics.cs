namespace Server.Models;

public class KpiSummary
{
    public double? TotalSales { get; set; }
    public int NumberOfTransactions { get; set; }
    public double? AverageBasketValue { get; set; }
}

public class StoreCategorySales
{
    public string store_id { get; set; } = null!;
    public string store_name { get; set; } = null!;
    public string category { get; set; } = null!;
    public double TotalSales { get; set; }
    public int UnitsSold { get; set; }
    public int NumberOfTransactions { get; set; }
}

public class StoreSalesPerformance
{
    public string store_id { get; set; } = null!;
    public string store_name { get; set; } = null!;
    public int Total_Transactions { get; set; }
    public double Total_Sales { get; set; }
}

public class ProductSalesPerformance
{
    public string product_id { get; set; } = null!;
    public string product_name { get; set; } = null!;
    public int Total_Transactions { get; set; }
    public double Total_Sales { get; set; }
}

public class CategorySalesPerformance
{
    public string category { get; set; } = null!;
    public int Total_Transactions { get; set; }
    public double Total_Sales { get; set; }
}

public class BrandSalesPerformance
{
    public string brand { get; set; } = null!;
    public int Total_Transactions { get; set; }
    public double Total_Sales { get; set; }
}

public class DailySalesTrend
{
    public DateTime SalesDate { get; set; }
    public double TotalSales { get; set; }
    public int NumberOfTransactions { get; set; }
    public double AverageBasketValue { get; set; }
}

public class YearlySalesTrend
{
    public int YEAR { get; set; }
    public int Total_Sales { get; set; }
    public double Total_Revenue { get; set; }
}

public class MonthlySalesTrend
{
    public int YEAR { get; set; }
    public string MONTH { get; set; } = null!;
    public int Total_Sales { get; set; }
    public double Total_Revenue { get; set; }
}

public class DailyStoreSales
{
    public DateTime SalesDate { get; set; }
    public string store_name { get; set; } = null!;
    public double TotalSales { get; set; }
    public int NumberOfTransactions { get; set; }
    public double AverageBasketValue { get; set; }
}
