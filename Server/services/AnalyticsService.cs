using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interfaces;
using Server.Models;

namespace Server.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly ApplicationDbContext _context;

    public AnalyticsService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Queries 1, 2 and 3: Completed transactions, total sales,
    // and average basket value.
    public async Task<KpiSummary> GetKpiSummaryAsync()
    {
        var query = _context.DemoSales
            .AsNoTracking()
            .Where(s => s.order_status == "Completed");

        var count = await query.CountAsync();
        var total = await query.SumAsync(s => (double?)s.total_amount);

        return new KpiSummary
        {
            TotalSales = total ?? 0,
            NumberOfTransactions = count,
            AverageBasketValue = count == 0
                ? 0
                : Math.Round((total ?? 0) / count, 2)
        };
    }

    // Query 4: Sales by store and product category.
    public async Task<IEnumerable<StoreCategorySales>>
        GetSalesByStoreAndCategoryAsync()
    {
        var query =
        from s in _context.DemoSales
            .AsNoTracking()
            .Where(s => s.order_status == "Completed")
        join st in _context.DemoStores.AsNoTracking()
            on s.store_id equals st.store_id
        join t in _context.DemoTransactions.AsNoTracking()
            on s.order_id equals t.order_id
        join p in _context.DemoProducts.AsNoTracking()
            on t.product_id equals p.product_id
        group new
        {
            s.order_id,
            st.store_id,
            st.store_name,
            p.category,
            t.quantity,
            t.line_net_amount,
            t.line_vat_amount
        }
        by new
        {
            st.store_id,
            st.store_name,
            p.category
        }
        into g
        select new StoreCategorySales
        {
            store_id = g.Key.store_id,
            store_name = g.Key.store_name,
            category = g.Key.category,

            TotalSales = g.Sum(x =>
                x.line_net_amount + x.line_vat_amount),

            UnitsSold = g.Sum(x => (int)x.quantity),

            NumberOfTransactions = g
                .Select(x => x.order_id)
                .Distinct()
                .Count()
        };

        return await query
            .OrderBy(x => x.store_name)
            .ThenByDescending(x => x.TotalSales)
            .ToListAsync();
    }

    // Query 5: Sales performance by store.
    // Preserves the original query's lack of a status filter.
    public async Task<IEnumerable<StoreSalesPerformance>>
        GetStorePerformanceAsync()
    {
        return await (
            from s in _context.DemoSales.AsNoTracking()
            join st in _context.DemoStores.AsNoTracking()
                on s.store_id equals st.store_id
            group s by new { s.store_id, st.store_name } into g
            select new StoreSalesPerformance
            {
                store_id = g.Key.store_id,
                store_name = g.Key.store_name,
                Total_Transactions = g.Count(),
                Total_Sales = g.Sum(s => s.total_amount)
            })
            .OrderBy(x => x.store_id)
            .ToListAsync();
    }

    // Query 6: Sales performance by product.
    public async Task<IEnumerable<ProductSalesPerformance>>
        GetProductPerformanceAsync()
    {
        return await (
            from t in _context.DemoTransactions.AsNoTracking()
            join p in _context.DemoProducts.AsNoTracking()
                on t.product_id equals p.product_id
            group t by new { t.product_id, p.product_name } into g
            select new ProductSalesPerformance
            {
                product_id = g.Key.product_id,
                product_name = g.Key.product_name,
                Total_Transactions = g.Count(),
                Total_Sales = g.Sum(t => t.line_net_amount)
            })
            .ToListAsync();
    }

    // Query 7: Sales performance by product category.
    public async Task<IEnumerable<CategorySalesPerformance>>
        GetCategoryPerformanceAsync()
    {
        return await (
            from t in _context.DemoTransactions.AsNoTracking()
            join p in _context.DemoProducts.AsNoTracking()
                on t.product_id equals p.product_id
            group t by p.category into g
            select new CategorySalesPerformance
            {
                category = g.Key,
                Total_Transactions = g.Count(),
                Total_Sales = g.Sum(t => t.line_net_amount)
            })
            .ToListAsync();
    }

    // Query 8: Sales performance by brand.
    public async Task<IEnumerable<BrandSalesPerformance>>
        GetBrandPerformanceAsync()
    {
        return await (
            from t in _context.DemoTransactions.AsNoTracking()
            join p in _context.DemoProducts.AsNoTracking()
                on t.product_id equals p.product_id
            group t by p.brand into g
            select new BrandSalesPerformance
            {
                brand = g.Key,
                Total_Transactions = g.Count(),
                Total_Sales = g.Sum(t => t.line_net_amount)
            })
            .ToListAsync();
    }

    // Query 9: Daily sales trend for completed sales.
    public async Task<IEnumerable<DailySalesTrend>>
        GetDailySalesTrendAsync()
    {
        return await _context.DemoSales
            .AsNoTracking()
            .Where(s => s.order_status == "Completed")
            .GroupBy(s => s.order_datetime.Date)
            .Select(g => new DailySalesTrend
            {
                SalesDate = g.Key,
                TotalSales = g.Sum(s => s.total_amount),
                NumberOfTransactions = g.Count(),
                AverageBasketValue = g.Average(s => s.total_amount)
            })
            .OrderBy(x => x.SalesDate)
            .ToListAsync();
    }

    // Query 10: Yearly sales trend.
    // Preserves the original query's lack of a status filter.
    public async Task<IEnumerable<YearlySalesTrend>>
        GetYearlySalesTrendAsync()
    {
        return await _context.DemoSales
            .AsNoTracking()
            .GroupBy(s => s.order_datetime.Year)
            .Select(g => new YearlySalesTrend
            {
                YEAR = g.Key,
                Total_Sales = g.Count(),
                Total_Revenue = g.Sum(s => s.total_amount)
            })
            .OrderBy(x => x.YEAR)
            .ToListAsync();
    }

    // Query 11: Monthly sales trend.
    // Preserves the original query's lack of a status filter.
    public async Task<IEnumerable<MonthlySalesTrend>>
        GetMonthlySalesTrendAsync()
    {
        var salesData = await _context.DemoSales
        .AsNoTracking()
        .GroupBy(s => new
        {
            Year = s.order_datetime.Year,
            Month = s.order_datetime.Month
        })
        .Select(g => new
        {
            YEAR = g.Key.Year,
            MONTH = g.Key.Month,
            Total_Sales = g.Count(),
            Total_Revenue = g.Sum(s => s.total_amount)
        })
        .OrderBy(x => x.YEAR)
        .ThenBy(x => x.MONTH)
        .ToListAsync();

        return salesData.Select(x => new MonthlySalesTrend
        {
            YEAR = x.YEAR,
            MONTH = new DateTime(x.YEAR, x.MONTH, 1)
                .ToString("MMMM"),
            Total_Sales = x.Total_Sales,
            Total_Revenue = x.Total_Revenue
        });
    }

    // Query 12: KPI summary with date and optional store filters.
    public async Task<KpiSummary> GetFilteredKpiSummaryAsync(
        DateTime startDate,
        DateTime endDate,
        string? storeId)
    {
        var query = _context.DemoSales
            .AsNoTracking()
            .Where(s =>
                s.order_status == "Completed" &&
                s.order_datetime >= startDate &&
                s.order_datetime < endDate);

        if (!string.IsNullOrWhiteSpace(storeId))
        {
            query = query.Where(s => s.store_id == storeId);
        }

        var count = await query.CountAsync();
        var total = await query.SumAsync(s => (double?)s.total_amount);

        return new KpiSummary
        {
            TotalSales = total ?? 0,
            NumberOfTransactions = count,
            AverageBasketValue = count == 0
                ? 0
                : (total ?? 0) / count
        };
    }

    // Query 13: Daily sales with date and optional store filters.
    public async Task<IEnumerable<DailyStoreSales>>
        GetFilteredDailySalesAsync(
            DateTime startDate,
            DateTime endDate,
            string? storeId)
    {
        var query =
            from s in _context.DemoSales.AsNoTracking()
            join st in _context.DemoStores.AsNoTracking()
                on s.store_id equals st.store_id
            where s.order_status == "Completed" &&
                  s.order_datetime >= startDate &&
                  s.order_datetime < endDate
            select new { s, st };

        if (!string.IsNullOrWhiteSpace(storeId))
        {
            query = query.Where(x => x.s.store_id == storeId);
        }

        return await query
            .GroupBy(x => new
            {
                SalesDate = x.s.order_datetime.Date,
                x.st.store_name
            })
            .Select(g => new DailyStoreSales
            {
                SalesDate = g.Key.SalesDate,
                store_name = g.Key.store_name,
                TotalSales = g.Sum(x => x.s.total_amount),
                NumberOfTransactions = g.Count(),
                AverageBasketValue = g.Average(x => x.s.total_amount)
            })
            .OrderBy(x => x.SalesDate)
            .ThenBy(x => x.store_name)
            .ToListAsync();
    }

    // Query 14: Sales by store and category with date filters.
    public async Task<IEnumerable<StoreCategorySales>>
        GetFilteredStoreCategorySalesAsync(
            DateTime startDate,
            DateTime endDate,
            string? storeId)
    {
        var query =
            from s in _context.DemoSales.AsNoTracking()
            join st in _context.DemoStores.AsNoTracking()
                on s.store_id equals st.store_id
            join t in _context.DemoTransactions.AsNoTracking()
                on s.order_id equals t.order_id
            join p in _context.DemoProducts.AsNoTracking()
                on t.product_id equals p.product_id
            where s.order_status == "Completed" &&
                  s.order_datetime >= startDate &&
                  s.order_datetime < endDate
            select new { s, st, t, p };

        if (!string.IsNullOrWhiteSpace(storeId))
        {
            query = query.Where(x => x.s.store_id == storeId);
        }

        return await query
            .GroupBy(x => new
            {
                x.st.store_id,
                x.st.store_name,
                x.p.category
            })
            .Select(g => new StoreCategorySales
            {
                store_id = g.Key.store_id,
                store_name = g.Key.store_name,
                category = g.Key.category,
                TotalSales = g.Sum(x =>
                    x.t.line_net_amount + x.t.line_vat_amount),
                UnitsSold = g.Sum(x => (int)x.t.quantity),
                NumberOfTransactions = g
                    .Select(x => x.s.order_id)
                    .Distinct()
                    .Count()
            })
            .OrderBy(x => x.store_name)
            .ThenByDescending(x => x.TotalSales)
            .ToListAsync();
    }
}
