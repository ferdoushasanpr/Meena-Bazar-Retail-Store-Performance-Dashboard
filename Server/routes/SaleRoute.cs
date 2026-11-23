using NLog;
using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class SaleRoute
{
    public static readonly Logger logger = LogManager.GetCurrentClassLogger();
    public static IEndpointRouteBuilder MapSaleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/sales").WithTags("Sales");

        group.MapGet("/", async (int pageNumber = 1, int pageSize = 10, ISaleService service = null!) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var sales = await service.GetAllSalesAsync(pageNumber, pageSize);

                logger.Info("Retrieved orders. PageNumber: {PageNumber}, PageSize: {PageSize}, TotalRecords: {TotalRecords}", pageNumber, pageSize, sales.TotalRecords);
                return Results.Ok(sales);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve all orders.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/{order_id}", async (
            string order_id,
            ISaleService service) =>
        {
            try
            {
                var sale = await service.GetSaleByIdAsync(order_id);

                if (sale is null)
                {
                    logger.Warn("No order found. OrderId: {OrderId}", order_id);
                    return Results.NotFound("No Order Found.");
                }

                logger.Info("Retrieved order successfully. {OrderId}", order_id);
                return Results.Ok(sale);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve order. OrderId: {OrderId}", order_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber, int pageSize, ISaleService service) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var result = await service.SearchSalesAsync(searchTerm, pageNumber, pageSize);

                logger.Info("Retrieved search orders successfully with SearchTerm: {SearchTerm}", searchTerm);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to search order with SearchTerm: {SearchTerm}", searchTerm);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapPost("/", async (
            Sale sale,
            ISaleService service) =>
        {
            try
            {
                var result = await service.AddSaleAsync(sale);

                if (!result)
                {
                    logger.Warn("Order not created.");
                    return Results.BadRequest();
                }

                return Results.Created($"/sales/{sale.order_id}", sale);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to create order.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapPut("/{order_id}", async (
            string order_id,
            Sale sale,
            ISaleService service) =>
        {
            try
            {
                if (order_id != sale.order_id)
                    return Results.BadRequest("Order ID mismatch.");

                var result = await service.UpdateSaleAsync(sale);

                if (!result)
                {
                    logger.Warn("Order not found. OrderId: {OrderId}", order_id);
                    return Results.NotFound("No Order Found.");
                }

                return Results.NoContent();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to update order. OrderId: {OrderId}", order_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapDelete("/{order_id}", async (
            string order_id,
            ISaleService service) =>
        {
            try
            {
                var result = await service.DeleteSaleAsync(order_id);

                if (!result)
                {
                    logger.Warn("Order not found. OrderId: {OrderId}", order_id);
                    return Results.NotFound("No Order Found.");
                }

                return Results.NoContent();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to delete order. OrderId: {OrderId}", order_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        return app;
    }
}