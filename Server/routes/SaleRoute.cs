using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class SaleRoute
{
    public static IEndpointRouteBuilder MapSaleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/sales").WithTags("Sales");

        group.MapGet("/", async (ISaleService service) =>
{
    var sales = await service.GetAllSalesAsync();
    return Results.Ok(sales);
});

        group.MapGet("/{order_id}", async (
            string order_id,
            ISaleService service) =>
        {
            var sale = await service.GetSaleByIdAsync(order_id);

            return sale is not null
                ? Results.Ok(sale)
                : Results.NotFound();
        });

        group.MapPost("/", async (
            Sale sale,
            ISaleService service) =>
        {
            var result = await service.AddSaleAsync(sale);

            return result
                ? Results.Created($"/sales/{sale.order_id}", sale)
                : Results.BadRequest();
        });

        group.MapPut("/{order_id}", async (
            string order_id,
            Sale sale,
            ISaleService service) =>
        {
            if (order_id != sale.order_id)
                return Results.BadRequest("Order ID mismatch.");

            var result = await service.UpdateSaleAsync(sale);

            return result ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/{order_id}", async (
            string order_id,
            ISaleService service) =>
        {
            var result = await service.DeleteSaleAsync(order_id);

            return result ? Results.NoContent() : Results.NotFound();
        });

        return app;
    }
}