using Server.Interfaces;

namespace Server.Routes;

public static class AnalyticsRoute
{
    public static IEndpointRouteBuilder MapAnalyticsEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/analytics")
            .WithTags("Sales Analytics");

        // Queries 1-3: KPI summary
        group.MapGet("/kpis", async (IAnalyticsService service) =>
            Results.Ok(await service.GetKpiSummaryAsync()));

        // Query 4
        group.MapGet("/store-category", async (
        int pageNumber,
        int pageSize,
        string? storeId,
        DateTime? startDate,
        DateTime? endDate,
        IAnalyticsService service) =>
    {
        pageNumber = Math.Max(1, pageNumber);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var result = await service.GetSalesByStoreAndCategoryAsync(
            pageNumber,
            pageSize,
            storeId,
        startDate,
        endDate);

        return Results.Ok(result);
    });

        // Query 5
        group.MapGet("/stores", async (DateTime? startDate, DateTime? endDate, IAnalyticsService service) =>
            Results.Ok(await service.GetStorePerformanceAsync(startDate, endDate)));

        // Query 6
        group.MapGet("/products", async (
        int pageNumber,
        int pageSize,
        DateTime? startDate,
        DateTime? endDate,
        IAnalyticsService service) =>
    {
        pageNumber = Math.Max(1, pageNumber);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var result = await service.GetProductPerformanceAsync(
            pageNumber,
            pageSize,
            startDate,
            endDate);

        return Results.Ok(result);
    });

        // Query 7
        group.MapGet("/categories", async (DateTime? startDate,
        DateTime? endDate, IAnalyticsService service) =>
            Results.Ok(await service.GetCategoryPerformanceAsync(startDate, endDate)));

        // Query 8
        group.MapGet("/brands", async (IAnalyticsService service) =>
            Results.Ok(await service.GetBrandPerformanceAsync()));

        // Query 9
        group.MapGet("/daily-trend", async (IAnalyticsService service) =>
            Results.Ok(await service.GetDailySalesTrendAsync()));

        // Query 10
        group.MapGet("/yearly-trend", async (IAnalyticsService service) =>
            Results.Ok(await service.GetYearlySalesTrendAsync()));

        // Query 11
        group.MapGet("/monthly-trend", async (IAnalyticsService service) =>
            Results.Ok(await service.GetMonthlySalesTrendAsync()));

        // Query 12
        group.MapGet("/kpis/filtered", async (
            DateTime startDate,
            DateTime endDate,
            string? storeId,
            IAnalyticsService service) =>
        {
            if (startDate >= endDate)
                return Results.BadRequest(
                    "startDate must be earlier than endDate.");

            var result = await service.GetFilteredKpiSummaryAsync(
                startDate, endDate, storeId);

            return Results.Ok(result);
        });

        // Query 13
        group.MapGet("/daily-sales/filtered", async (
            DateTime startDate,
            DateTime endDate,
            string? storeId,
            IAnalyticsService service) =>
        {
            if (startDate >= endDate)
                return Results.BadRequest(
                    "startDate must be earlier than endDate.");

            var result = await service.GetFilteredDailySalesAsync(
                startDate, endDate, storeId);

            return Results.Ok(result);
        });

        // Query 14
        group.MapGet("/store-category/filtered", async (
            DateTime startDate,
            DateTime endDate,
            string? storeId,
            IAnalyticsService service) =>
        {
            if (startDate >= endDate)
                return Results.BadRequest(
                    "startDate must be earlier than endDate.");

            var result = await service.GetFilteredStoreCategorySalesAsync(
                startDate, endDate, storeId);

            return Results.Ok(result);
        });

        return app;
    }
}
