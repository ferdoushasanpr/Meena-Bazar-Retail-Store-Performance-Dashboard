using NLog;
using Server.Interfaces;

namespace Server.Routes;

public static class AnalyticsRoute
{
    public static readonly Logger logger = LogManager.GetCurrentClassLogger();
    public static IEndpointRouteBuilder MapAnalyticsEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/analytics")
            .WithTags("Sales Analytics")
            .RequireAuthorization();

        group.MapGet("/entitycount", async (IAnalyticsService service) =>
        {
            return Results.Ok(await service.GetEntityCountSummaryAsync());
        });

        group.MapGet("/kpis", async (IAnalyticsService service) =>
        {
            return Results.Ok(await service.GetKpiSummaryAsync());
        });

        group.MapGet("/store-category", async (
        int pageNumber,
        int pageSize,
        string? storeId,
        DateTime? startDate,
        DateTime? endDate,
        IAnalyticsService service) =>
        {
            if (pageNumber < 1 || pageSize < 1)
            {
                logger.Warn("Invalid pagination parameters.");
                return Results.BadRequest("Invalid pagination parameters.");
            }

            if (startDate >= endDate)
            {
                logger.Warn("startDate must be earlier than endDate.");
                return Results.BadRequest(
                    "startDate must be earlier than endDate.");
            }

            var result = await service.GetSalesByStoreAndCategoryAsync(
                pageNumber,
                pageSize,
                storeId,
                startDate,
                endDate);

            logger.Info("Retrieved store category sales. PageNumber: {PageNumber}, PageSize: {PageSize}, TotalRecords: {TotalRecords}", pageNumber, pageSize, result.TotalRecords);
            return Results.Ok(result);
        });

        group.MapGet("/store-product", async (
            int pageNumber,
            int pageSize,
            string? storeId,
            DateTime? startDate,
            DateTime? endDate,
            IAnalyticsService service) =>
        {
            if (pageNumber < 1 || pageSize < 1)
            {
                logger.Warn("Invalid pagination parameters.");
                return Results.BadRequest("Invalid pagination parameters.");
            }

            if (startDate >= endDate)
            {
                logger.Warn("startDate must be earlier than endDate.");
                return Results.BadRequest(
                    "startDate must be earlier than endDate.");
            }

            var result = await service.GetSalesByStoreAndProductAsync(
                pageNumber,
                pageSize,
                storeId,
                startDate,
                endDate);

            logger.Info("Retrieved store product sales. PageNumber: {PageNumber}, PageSize: {PageSize}, TotalRecords: {TotalRecords}", pageNumber, pageSize, result.TotalRecords);
            return Results.Ok(result);
        });

        group.MapGet("/stores", async (DateTime? startDate, DateTime? endDate, IAnalyticsService service) =>
        {
            if (startDate >= endDate)
            {
                logger.Warn("startDate must be earlier than endDate.");
                return Results.BadRequest(
                    "startDate must be earlier than endDate.");
            }

            var result = await service.GetStorePerformanceAsync(startDate, endDate);
            logger.Info("Retrieved store sales. From: {StartDate} - To: {EndDate}", startDate, endDate);
            return Results.Ok(result);
        });

        group.MapGet("/products", async (
        int pageNumber,
        int pageSize,
        DateTime? startDate,
        DateTime? endDate,
        IAnalyticsService service) =>
        {
            if (pageNumber < 1 || pageSize < 1)
            {
                logger.Warn("Invalid pagination parameters.");
                return Results.BadRequest("Invalid pagination parameters.");
            }

            if (startDate >= endDate)
            {
                logger.Warn("startDate must be earlier than endDate.");
                return Results.BadRequest(
                    "startDate must be earlier than endDate.");
            }

            var result = await service.GetProductPerformanceAsync(
                pageNumber,
                pageSize,
                startDate,
                endDate);

            logger.Info("Retrieved product sales. PageNumber: {PageNumber}, PageSize: {PageSize}, TotalRecords: {TotalRecords}", pageNumber, pageSize, result.TotalRecords);
            return Results.Ok(result);
        });

        group.MapGet("/categories", async (DateTime? startDate, DateTime? endDate, IAnalyticsService service) =>
        {
            if (startDate >= endDate)
            {
                logger.Warn("startDate must be earlier than endDate.");
                return Results.BadRequest(
                    "startDate must be earlier than endDate.");
            }

            var result = await service.GetCategoryPerformanceAsync(startDate, endDate);
            logger.Info("Retrieved categories sales. From: {StartDate} - To: {EndDate}", startDate, endDate);
            return Results.Ok(result);
        });

        group.MapGet("/brands", async (IAnalyticsService service) =>
        {
            var result = await service.GetBrandPerformanceAsync();
            logger.Info("Retrieved brands sales successfully.");
            return Results.Ok(result);
        });

        group.MapGet("/daily-trend", async (IAnalyticsService service) =>
        {
            var result = await service.GetDailySalesTrendAsync();
            logger.Info("Retrieved daily sales trend successfully.");
            return Results.Ok(result);
        });

        group.MapGet("/monthly-trend", async (IAnalyticsService service) =>
        {
            return Results.Ok(await service.GetMonthlySalesTrendAsync());
        });

        group.MapGet("/yearly-trend", async (IAnalyticsService service) =>
        {
            var result = await service.GetYearlySalesTrendAsync();
            logger.Info("Retrieved yearly sales trend successfully.");
            return Results.Ok(result);
        });

        group.MapGet("/kpis/filtered", async (
            DateTime startDate,
            DateTime endDate,
            string? storeId,
            IAnalyticsService service) =>
        {
            if (startDate >= endDate)
            {
                logger.Warn("startDate must be earlier than endDate.");
                return Results.BadRequest(
                    "startDate must be earlier than endDate.");
            }

            return Results.Ok(await service.GetFilteredKpiSummaryAsync(
                startDate, endDate, storeId));
        });

        group.MapGet("/daily-sales/filtered", async (
            DateTime startDate,
            DateTime endDate,
            string? storeId,
            IAnalyticsService service) =>
        {
            if (startDate >= endDate)
            {
                logger.Warn("startDate must be earlier than endDate.");
                return Results.BadRequest(
                    "startDate must be earlier than endDate.");
            }

            var result = await service.GetFilteredDailySalesAsync(
                startDate, endDate, storeId);

            logger.Info("Retrieved filtered daily store sales successfully.");
            return Results.Ok(result);
        });

        group.MapGet("/store-category/filtered", async (
            DateTime startDate,
            DateTime endDate,
            string? storeId,
            IAnalyticsService service) =>
        {
            if (startDate >= endDate)
            {
                logger.Warn("startDate must be earlier than endDate.");
                return Results.BadRequest(
                    "startDate must be earlier than endDate.");
            }

            var result = await service.GetFilteredStoreCategorySalesAsync(
                startDate, endDate, storeId);

            logger.Info("Retrieved filtered store category sales successfully.");
            return Results.Ok(result);
        });

        return app;
    }
}
