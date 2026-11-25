using NLog;
using Server.DTOs;
using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class TransactionRoute
{
    public static readonly Logger logger = LogManager.GetCurrentClassLogger();
    public static IEndpointRouteBuilder MapTransactionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/transactions").WithTags("Transactions").RequireAuthorization();

        group.MapGet("/", async (int pageNumber, int pageSize, ITransactionService service) =>
        {
            if (pageNumber < 1 || pageSize < 1)
                return Results.BadRequest("Invalid pagination parameters.");

            var transactions = await service.GetAllTransactionsAsync(pageNumber, pageSize);

            logger.Info("Retrieved transactions. PageNumber: {PageNumber}, PageSize: {PageSize}, TotalRecords: {TotalRecords}", pageNumber, pageSize, transactions.TotalRecords);
            return Results.Ok(transactions);
        });

        group.MapGet("/{order_item_id}", async (
            string order_item_id,
            ITransactionService service) =>
        {
            var transaction = await service.GetTransactionByIdAsync(order_item_id);

            if (transaction is null)
            {
                logger.Warn("No transaction found. Order_item_Id: {Order_item_Id}", order_item_id);
                return Results.NotFound("No transaction Found.");
            }

            logger.Info("Retrieved transaction successfully. {Order_item_Id}", order_item_id);
            return Results.Ok(transaction);
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber, int pageSize, ITransactionService service) =>
        {
            if (pageNumber < 1 || pageSize < 1)
                return Results.BadRequest("Invalid pagination parameters.");

            var result = await service.SearchTransactionsAsync(searchTerm, pageNumber, pageSize);

            logger.Info("Retrieved search transactions successfully with SearchTerm: {SearchTerm}", searchTerm);
            return Results.Ok(result);
        });

        group.MapPost("/", async (
            Transaction transaction,
            ITransactionService service) =>
        {
            var result = await service.AddTransactionAsync(transaction);

            if (!result)
            {
                logger.Warn("Order item not created.");
                return Results.BadRequest();
            }

            return Results.Created(
                    $"/transactions/{transaction.order_item_id}", transaction);
        });

        group.MapPut("/{order_item_id}", async (
            string order_item_id,
            TransactionRequest transaction,
            ITransactionService service) =>
        {
            if (order_item_id != transaction.order_item_id)
                return Results.BadRequest("Order item ID mismatch.");

            var result = await service.UpdateTransactionAsync(transaction);

            if (!result)
            {
                logger.Warn("Order item not found. Order_item_Id: {Order_item_Id}", order_item_id);
                return Results.NotFound("No Order item Found.");
            }

            return Results.NoContent();
        });

        group.MapDelete("/{order_item_id}", async (
            string order_item_id,
            ITransactionService service) =>
        {
            var result = await service.DeleteTransactionAsync(order_item_id);

            if (!result)
            {
                logger.Warn("Order item not found. Order_item_Id: {Order_item_Id}", order_item_id);
                return Results.NotFound("No Order item Found.");
            }

            return Results.NoContent();
        });

        return app;
    }
}