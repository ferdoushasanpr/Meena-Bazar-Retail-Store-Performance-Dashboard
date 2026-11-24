using Microsoft.EntityFrameworkCore;
using NLog;
using Server.Data;
using Server.Interfaces;
using Server.Models;

namespace Server.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly ApplicationDbContext _context;
    private readonly Logger logger = LogManager.GetCurrentClassLogger();

    public AnalyticsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EntityCountSummary> GetEntityCountSummaryAsync()
    {
        try
        {
            var customers = _context.DemoCustomers.AsNoTracking();
            var products = _context.DemoProducts.AsNoTracking();
            var catagories = _context.DemoProducts.Select(c => c.category).Distinct().AsNoTracking();
            var stores = _context.DemoStores.AsNoTracking();
            var orders = _context.DemoSales.AsNoTracking();

            var countCustomer = await customers.CountAsync();
            var countProduct = await products.CountAsync();
            var countCatagory = await catagories.CountAsync();
            var countStore = await stores.CountAsync();
            var countOrder = await orders.CountAsync();

            logger.Info("Retrieved entitycountsummary successfully.");

            return new EntityCountSummary
            {
                NumberOfCustomer = countCustomer,
                NumberOfProduct = countProduct,
                NumberOfCategory = countCatagory,
                NumberOfStore = countStore,
                NumberOfOrder = countOrder
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve EntityCountSummary.");
            throw;
        }
    }
    public async Task<KpiSummary> GetKpiSummaryAsync()
    {
        try
        {
            var query = _context.DemoSales
                .AsNoTracking()
                .Where(s => s.order_status == "Completed");

            var count = await query.CountAsync();
            var total = await query.SumAsync(s => (double?)s.total_amount);

            var distinctDays = await query
            .Select(s => s.order_datetime.Date)
            .Distinct()
            .CountAsync();

            logger.Info("Retrieved KPIsummary successfully.");

            return new KpiSummary
            {
                TotalSales = total ?? 0,
                NumberOfTransactions = count,
                AverageBasketValue = count == 0
                    ? 0
                    : Math.Round((total ?? 0) / count, 2),
                AverageDailySales = distinctDays == 0
                ? 0
                : Math.Round((total ?? 0) / distinctDays, 2)
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve KPISummary.");
            throw;
        }
    }

    public async Task<PaginatedResponse<StoreCategorySales>>
    GetSalesByStoreAndCategoryAsync(
        int pageNumber,
        int pageSize,
        string? storeId = null,
        DateTime? startDate = null,
        DateTime? endDate = null)
    {
        try
        {
            var salesQuery = _context.DemoSales
                .AsNoTracking()
                .Where(s => s.order_status == "Completed");

            if (!string.IsNullOrWhiteSpace(storeId))
            {
                salesQuery = salesQuery
                    .Where(s => s.store_id == storeId);
            }

            if (startDate.HasValue)
            {
                salesQuery = salesQuery
                    .Where(s => s.order_datetime >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                var exclusiveEndDate = endDate.Value.Date.AddDays(1);
                salesQuery = salesQuery
                    .Where(s => s.order_datetime < exclusiveEndDate);
            }

            var query =
                from s in salesQuery
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

            var totalRecords = await query.CountAsync();

            var data = await query
                .OrderBy(x => x.store_name)
                .ThenByDescending(x => x.TotalSales)
                .ThenBy(x => x.category)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<StoreCategorySales>
            {
                Data = data,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = (int)Math.Ceiling(
                    (double)totalRecords / pageSize)
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all store category sales. PageNumber: {PageNumber}, PageSize: {PageSize}", pageNumber, pageSize);
            throw;
        }
    }

    public async Task<PaginatedResponse<StoreProductSales>> GetSalesByStoreAndProductAsync(int pageNumber, int pageSize, string? storeId = null, DateTime? startDate = null, DateTime? endDate = null)
    {
        try
        {
            var salesQuery = _context.DemoSales
                .AsNoTracking()
                .Where(s => s.order_status == "Completed");

            if (!string.IsNullOrWhiteSpace(storeId))
            {
                salesQuery = salesQuery
                    .Where(s => s.store_id == storeId);
            }

            if (startDate.HasValue)
            {
                salesQuery = salesQuery
                    .Where(s => s.order_datetime >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                var exclusiveEndDate = endDate.Value.Date.AddDays(1);

                salesQuery = salesQuery
                    .Where(s => s.order_datetime < exclusiveEndDate);
            }

            var query = from s in salesQuery
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
                            p.product_id,
                            p.product_name,
                            t.quantity,
                            t.line_net_amount,
                            t.line_vat_amount
                        } by new
                        {
                            st.store_id,
                            st.store_name,
                            p.product_id,
                            p.product_name,
                        } into g
                        select new StoreProductSales
                        {
                            store_id = g.Key.store_id,
                            store_name = g.Key.store_name,
                            product_name = g.Key.product_name,

                            TotalSales = g.Sum(x =>
                                x.line_net_amount + x.line_vat_amount),

                            UnitsSold = g.Sum(x => (int)x.quantity),

                            NumberOfTransactions = g
                                .Select(x => x.order_id)
                                .Distinct()
                                .Count()
                        };

            var totalRecords = await query.CountAsync();

            var data = await query
                .OrderBy(x => x.store_name)
                .ThenByDescending(x => x.TotalSales)
                .ThenBy(x => x.product_name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<StoreProductSales>
            {
                Data = data,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = (int)Math.Ceiling(
                    (double)totalRecords / pageSize)
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all store product sales. PageNumber: {PageNumber}, PageSize: {PageSize}", pageNumber, pageSize);
            throw;
        }
    }

    public async Task<IEnumerable<StoreSalesPerformance>> GetStorePerformanceAsync(DateTime? startDate, DateTime? endDate)
    {
        try
        {
            return await (
                from s in _context.DemoSales.AsNoTracking()
                join st in _context.DemoStores.AsNoTracking()
                    on s.store_id equals st.store_id
                where (!startDate.HasValue || s.order_datetime >= startDate.Value)
                   && (!endDate.HasValue || s.order_datetime < endDate.Value.Date.AddDays(1))
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
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all store sales.");
            throw;
        }
    }

    public async Task<PaginatedResponse<ProductSalesPerformance>> GetProductPerformanceAsync(
        int pageNumber,
        int pageSize,
        DateTime? startDate = null,
        DateTime? endDate = null)
    {
        try
        {
            var query =
                from t in _context.DemoTransactions.AsNoTracking()
                join s in _context.DemoSales.AsNoTracking()
                    on t.order_id equals s.order_id
                join p in _context.DemoProducts.AsNoTracking()
                    on t.product_id equals p.product_id
                where
                    (!startDate.HasValue ||
                        s.order_datetime >= startDate.Value)
                    &&
                    (!endDate.HasValue ||
                        s.order_datetime < endDate.Value.Date.AddDays(1))
                group t by new
                {
                    t.product_id,
                    p.product_name
                }
                into g
                select new ProductSalesPerformance
                {
                    product_id = g.Key.product_id,
                    product_name = g.Key.product_name,
                    Total_Transactions = g.Count(),
                    Total_Sales = g.Sum(t => t.line_net_amount)
                };

            var totalRecords = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.Total_Sales)
                .ThenBy(x => x.product_id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<ProductSalesPerformance>
            {
                Data = data,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = (int)Math.Ceiling(
                    (double)totalRecords / pageSize)
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all product sales. PageNumber: {PageNumber}, PageSize: {PageSize}", pageNumber, pageSize);
            throw;
        }
    }

    public async Task<IEnumerable<CategorySalesPerformance>>
    GetCategoryPerformanceAsync(
        DateTime? startDate = null,
        DateTime? endDate = null)
    {
        try
        {
            var salesQuery = _context.DemoSales
                .AsNoTracking()
                .Where(s => s.order_status == "Completed");

            if (startDate.HasValue)
            {
                salesQuery = salesQuery
                    .Where(s => s.order_datetime >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                var exclusiveEndDate = endDate.Value.Date.AddDays(1);

                salesQuery = salesQuery
                    .Where(s => s.order_datetime < exclusiveEndDate);
            }

            var query =
                from t in _context.DemoTransactions.AsNoTracking()
                join s in salesQuery
                    on t.order_id equals s.order_id
                join p in _context.DemoProducts.AsNoTracking()
                    on t.product_id equals p.product_id
                group t by p.category into g
                select new CategorySalesPerformance
                {
                    category = g.Key,
                    Total_Transactions = g.Count(),
                    Total_Sales = g.Sum(t => t.line_net_amount)
                };

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all category sales.");
            throw;
        }
    }

    public async Task<IEnumerable<BrandSalesPerformance>>
        GetBrandPerformanceAsync()
    {
        try
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
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all brand sales.");
            throw;
        }
    }

    // Daily sales trend for completed sales.
    public async Task<IEnumerable<DailySalesTrend>>
        GetDailySalesTrendAsync()
    {
        try
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
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all daily sales.");
            throw;
        }
    }

    // Monthly sales trend.
    public async Task<IEnumerable<MonthlySalesTrend>>
        GetMonthlySalesTrendAsync()
    {
        try
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

            logger.Info("Retrieved monthly sales trend successfully.");

            return salesData.Select(x => new MonthlySalesTrend
            {
                YEAR = x.YEAR,
                MONTH = new DateTime(x.YEAR, x.MONTH, 1)
                    .ToString("MMMM"),
                Total_Sales = x.Total_Sales,
                Total_Revenue = x.Total_Revenue
            });
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all monthly sales.");
            throw;
        }
    }

    // Yearly sales trend.
    public async Task<IEnumerable<YearlySalesTrend>>
        GetYearlySalesTrendAsync()
    {
        try
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
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all yearly sales.");
            throw;
        }
    }

    public async Task<KpiSummary> GetFilteredKpiSummaryAsync(
        DateTime startDate,
        DateTime endDate,
        string? storeId)
    {
        try
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
            var distinctDays = await query
            .Select(s => s.order_datetime.Date)
            .Distinct()
            .CountAsync();

            logger.Info("Retrieved filtered KPI summary successfully.");

            return new KpiSummary
            {
                TotalSales = total ?? 0,
                NumberOfTransactions = count,
                AverageBasketValue = count == 0
                    ? 0
                    : Math.Round((total ?? 0) / count, 2),
                AverageDailySales = distinctDays == 0
                ? 0
                : Math.Round((total ?? 0) / distinctDays, 2)
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve filtered KPISummary.");
            throw;
        }
    }

    // Daily sales with date and optional store filters.
    public async Task<IEnumerable<DailyStoreSales>>
        GetFilteredDailySalesAsync(
            DateTime startDate,
            DateTime endDate,
            string? storeId)
    {
        try
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
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all daily store sales.");
            throw;
        }
    }

    // Sales by store and category with date filters.
    public async Task<IEnumerable<StoreCategorySales>>
        GetFilteredStoreCategorySalesAsync(
            DateTime startDate,
            DateTime endDate,
            string? storeId)
    {
        try
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
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all store category sales.");
            throw;
        }
    }
}
