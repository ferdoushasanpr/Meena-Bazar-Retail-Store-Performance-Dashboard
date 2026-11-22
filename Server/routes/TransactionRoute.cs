using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class TransactionRoute
{
    public static IEndpointRouteBuilder MapTransactionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/transactions").WithTags("Transactions");

        group.MapGet("/", async (int pageNumber, int pageSize, ITransactionService service) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var transactions = await service.GetAllTransactionsAsync(pageNumber, pageSize);
                return Results.Ok(transactions);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/{order_item_id}", async (
            string order_item_id,
            ITransactionService service) =>
        {
            try
            {
                var transaction = await service.GetTransactionByIdAsync(order_item_id);

                return transaction is not null
                    ? Results.Ok(transaction)
                    : Results.NotFound();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber, int pageSize, ITransactionService service) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var result = await service.SearchTransactionsAsync(searchTerm, pageNumber, pageSize);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapPost("/", async (
            Transaction transaction,
            ITransactionService service) =>
        {
            try
            {
                var result = await service.AddTransactionAsync(transaction);

                return result
                    ? Results.Created(
                        $"/transactions/{transaction.order_item_id}", transaction)
                    : Results.BadRequest();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapPut("/{order_item_id}", async (
            string order_item_id,
            Transaction transaction,
            ITransactionService service) =>
        {
            try
            {
                if (order_item_id != transaction.order_item_id)
                    return Results.BadRequest("Order item ID mismatch.");

                var result = await service.UpdateTransactionAsync(transaction);

                return result ? Results.NoContent() : Results.NotFound();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapDelete("/{order_item_id}", async (
            string order_item_id,
            ITransactionService service) =>
        {
            try
            {
                var result = await service.DeleteTransactionAsync(order_item_id);

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