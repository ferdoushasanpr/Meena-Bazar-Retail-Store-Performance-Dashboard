using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class TransactionRoute
{
    public static IEndpointRouteBuilder MapTransactionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/transactions").WithTags("Transactions");

        group.MapGet("/", async (ITransactionService service) =>
{
    var transactions = await service.GetAllTransactionsAsync();
    return Results.Ok(transactions);
});

        group.MapGet("/{order_item_id}", async (
            string order_item_id,
            ITransactionService service) =>
        {
            var transaction = await service.GetTransactionByIdAsync(order_item_id);

            return transaction is not null
                ? Results.Ok(transaction)
                : Results.NotFound();
        });

        group.MapPost("/", async (
            Transaction transaction,
            ITransactionService service) =>
        {
            var result = await service.AddTransactionAsync(transaction);

            return result
                ? Results.Created(
                    $"/transactions/{transaction.order_item_id}", transaction)
                : Results.BadRequest();
        });

        group.MapPut("/{order_item_id}", async (
            string order_item_id,
            Transaction transaction,
            ITransactionService service) =>
        {
            if (order_item_id != transaction.order_item_id)
                return Results.BadRequest("Order item ID mismatch.");

            var result = await service.UpdateTransactionAsync(transaction);

            return result ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/{order_item_id}", async (
            string order_item_id,
            ITransactionService service) =>
        {
            var result = await service.DeleteTransactionAsync(order_item_id);

            return result ? Results.NoContent() : Results.NotFound();
        });

        return app;
    }
}