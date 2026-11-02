using Server.Models;

namespace Server.Interfaces;

public interface IAnalyticsService
{
    Task<KpiSummary> GetKpiSummaryAsync();
    Task<PaginatedResponse<StoreCategorySales>>
    GetSalesByStoreAndCategoryAsync(
        int pageNumber,
        int pageSize);
    Task<IEnumerable<StoreSalesPerformance>> GetStorePerformanceAsync(DateTime? startDate, DateTime? endDate);
    Task<PaginatedResponse<ProductSalesPerformance>>
    GetProductPerformanceAsync(
        int pageNumber,
        int pageSize,
        DateTime? startDate,
        DateTime? endDate);
    Task<IEnumerable<CategorySalesPerformance>> GetCategoryPerformanceAsync();
    Task<IEnumerable<BrandSalesPerformance>> GetBrandPerformanceAsync();
    Task<IEnumerable<DailySalesTrend>> GetDailySalesTrendAsync();
    Task<IEnumerable<YearlySalesTrend>> GetYearlySalesTrendAsync();
    Task<IEnumerable<MonthlySalesTrend>> GetMonthlySalesTrendAsync();
    Task<KpiSummary> GetFilteredKpiSummaryAsync(
        DateTime startDate,
        DateTime endDate,
        string? storeId);
    Task<IEnumerable<DailyStoreSales>> GetFilteredDailySalesAsync(
        DateTime startDate,
        DateTime endDate,
        string? storeId);
    Task<IEnumerable<StoreCategorySales>> GetFilteredStoreCategorySalesAsync(
        DateTime startDate,
        DateTime endDate,
        string? storeId);
}
