using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class SaleRoute
{
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
                return Results.Ok(sales);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/{order_id}", async (
            string order_id,
            ISaleService service) =>
        {
            try
            {
                var sale = await service.GetSaleByIdAsync(order_id);

                return sale is not null
                    ? Results.Ok(sale)
                    : Results.NotFound();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber, int pageSize, ISaleService service) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var result = await service.SearchSalesAsync(searchTerm, pageNumber, pageSize);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapPost("/", async (
            Sale sale,
            ISaleService service) =>
        {
            try
            {
                var result = await service.AddSaleAsync(sale);

                return result
                    ? Results.Created($"/sales/{sale.order_id}", sale)
                    : Results.BadRequest();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
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

                return result ? Results.NoContent() : Results.NotFound();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapDelete("/{order_id}", async (
            string order_id,
            ISaleService service) =>
        {
            try
            {
                var result = await service.DeleteSaleAsync(order_id);
                return result ? Results.NoContent() : Results.NotFound();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        return app;
    }
}