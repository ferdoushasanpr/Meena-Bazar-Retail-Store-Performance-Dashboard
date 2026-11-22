using Server.Interfaces;

namespace Server.Routes;

public static class AnalyticsRoute
{
    public static IEndpointRouteBuilder MapAnalyticsEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/analytics")
            .WithTags("Sales Analytics");

        group.MapGet("/entitycount", async (IAnalyticsService service) =>
        {
            try
            {
                return Results.Ok(await service.GetEntityCountSummaryAsync());
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/kpis", async (IAnalyticsService service) =>
        {
            try
            {
                return Results.Ok(await service.GetKpiSummaryAsync());
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/store-category", async (
        int pageNumber,
        int pageSize,
        string? storeId,
        DateTime? startDate,
        DateTime? endDate,
        IAnalyticsService service) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                if (startDate >= endDate)
                    return Results.BadRequest(
                        "startDate must be earlier than endDate.");

                var result = await service.GetSalesByStoreAndCategoryAsync(
                    pageNumber,
                    pageSize,
                    storeId,
                    startDate,
                    endDate);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/store-product", async (
            int pageNumber,
            int pageSize,
            string? storeId,
            DateTime? startDate,
            DateTime? endDate,
            IAnalyticsService service) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                if (startDate >= endDate)
                    return Results.BadRequest(
                        "startDate must be earlier than endDate.");

                var result = await service.GetSalesByStoreAndProductAsync(
                    pageNumber,
                    pageSize,
                    storeId,
                    startDate,
                    endDate);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/stores", async (DateTime? startDate, DateTime? endDate, IAnalyticsService service) =>
        {
            try
            {
                if (startDate >= endDate)
                    return Results.BadRequest(
                        "startDate must be earlier than endDate.");

                return Results.Ok(await service.GetStorePerformanceAsync(startDate, endDate));
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/products", async (
        int pageNumber,
        int pageSize,
        DateTime? startDate,
        DateTime? endDate,
        IAnalyticsService service) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                if (startDate >= endDate)
                    return Results.BadRequest(
                        "startDate must be earlier than endDate.");

                var result = await service.GetProductPerformanceAsync(
                    pageNumber,
                    pageSize,
                    startDate,
                    endDate);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/categories", async (DateTime? startDate, DateTime? endDate, IAnalyticsService service) =>
        {
            try
            {
                if (startDate >= endDate)
                    return Results.BadRequest(
                        "startDate must be earlier than endDate.");

                return Results.Ok(await service.GetCategoryPerformanceAsync(startDate, endDate));
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/brands", async (IAnalyticsService service) =>
        {
            try
            {
                return Results.Ok(await service.GetBrandPerformanceAsync());
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/daily-trend", async (IAnalyticsService service) =>
        {
            try
            {
                return Results.Ok(await service.GetDailySalesTrendAsync());
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/yearly-trend", async (IAnalyticsService service) =>
        {
            try
            {
                return Results.Ok(await service.GetYearlySalesTrendAsync());
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/monthly-trend", async (IAnalyticsService service) =>
        {
            try
            {
                return Results.Ok(await service.GetMonthlySalesTrendAsync());
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/kpis/filtered", async (
            DateTime startDate,
            DateTime endDate,
            string? storeId,
            IAnalyticsService service) =>
        {
            try
            {
                if (startDate >= endDate)
                    return Results.BadRequest(
                        "startDate must be earlier than endDate.");

                var result = await service.GetFilteredKpiSummaryAsync(
                    startDate, endDate, storeId);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/daily-sales/filtered", async (
            DateTime startDate,
            DateTime endDate,
            string? storeId,
            IAnalyticsService service) =>
        {
            try
            {
                if (startDate >= endDate)
                    return Results.BadRequest(
                        "startDate must be earlier than endDate.");

                var result = await service.GetFilteredDailySalesAsync(
                    startDate, endDate, storeId);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/store-category/filtered", async (
            DateTime startDate,
            DateTime endDate,
            string? storeId,
            IAnalyticsService service) =>
        {
            try
            {
                if (startDate >= endDate)
                    return Results.BadRequest(
                        "startDate must be earlier than endDate.");

                var result = await service.GetFilteredStoreCategorySalesAsync(
                    startDate, endDate, storeId);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        return app;
    }
}
