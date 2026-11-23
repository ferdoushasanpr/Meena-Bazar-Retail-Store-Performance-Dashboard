using NLog;
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
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var transactions = await service.GetAllTransactionsAsync(pageNumber, pageSize);

                logger.Info("Retrieved transactions. PageNumber: {PageNumber}, PageSize: {PageSize}, TotalRecords: {TotalRecords}", pageNumber, pageSize, transactions.TotalRecords);
                return Results.Ok(transactions);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve all transactions.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/{order_item_id}", async (
            string order_item_id,
            ITransactionService service) =>
        {
            try
            {
                var transaction = await service.GetTransactionByIdAsync(order_item_id);

                if (transaction is null)
                {
                    logger.Warn("No transaction found. Order_item_Id: {Order_item_Id}", order_item_id);
                    return Results.NotFound("No transaction Found.");
                }

                logger.Info("Retrieved transaction successfully. {Order_item_Id}", order_item_id);
                return Results.Ok(transaction);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve transaction. Order_item_Id: {Order_item_Id}", order_item_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber, int pageSize, ITransactionService service) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var result = await service.SearchTransactionsAsync(searchTerm, pageNumber, pageSize);

                logger.Info("Retrieved search transactions successfully with SearchTerm: {SearchTerm}", searchTerm);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to search transaction with SearchTerm: {SearchTerm}", searchTerm);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapPost("/", async (
            Transaction transaction,
            ITransactionService service) =>
        {
            try
            {
                var result = await service.AddTransactionAsync(transaction);

                if (!result)
                {
                    logger.Warn("Order item not created.");
                    return Results.BadRequest();
                }

                return Results.Created(
                        $"/transactions/{transaction.order_item_id}", transaction);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to create order item.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
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

                if (!result)
                {
                    logger.Warn("Order item not found. Order_item_Id: {Order_item_Id}", order_item_id);
                    return Results.NotFound("No Order item Found.");
                }

                return Results.NoContent();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to update order item. Order_item_Id: {Order_item_Id}", order_item_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapDelete("/{order_item_id}", async (
            string order_item_id,
            ITransactionService service) =>
        {
            try
            {
                var result = await service.DeleteTransactionAsync(order_item_id);

                if (!result)
                {
                    logger.Warn("Order item not found. Order_item_Id: {Order_item_Id}", order_item_id);
                    return Results.NotFound("No Order item Found.");
                }

                return Results.NoContent();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to delete order item. Order_item_Id: {Order_item_Id}", order_item_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        return app;
    }
}