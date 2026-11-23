using NLog;
using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class StoreRoute
{
    private static readonly Logger logger = LogManager.GetCurrentClassLogger();
    public static IEndpointRouteBuilder MapStoreEndpoints(this IEndpointRouteBuilder app)
    {

        var group = app.MapGroup("/stores").WithTags("Stores");

        group.MapGet("/", async (IStoreService service) =>
        {
            try
            {
                var stores = await service.GetAllStoresAsync();

                logger.Info("Retrieved all stores successfully. Count: {Count}",
                    stores.Count());
                return Results.Ok(stores);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve all stores.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/paginated", async (int pageNumber = 1, int pageSize = 10, IStoreService service = null!) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var stores = await service.GetPaginatedStoresAsync(pageNumber, pageSize);

                logger.Info("Retrieved paginated stores. PageNumber: {PageNumber}, PageSize: {PageSize}, TotalRecords: {TotalRecords}", pageNumber, pageSize, stores.TotalRecords);
                return Results.Ok(stores);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve all paginated stores.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/{store_id}", async (
            string store_id,
            IStoreService service) =>
        {
            try
            {
                var store = await service.GetStoreByIdAsync(store_id);

                if (store is null)
                {
                    logger.Warn("No store found. StoreId: {StoreId}", store_id);
                    return Results.NotFound();
                }

                logger.Info("Retrieved store successfully. {StoreId}", store_id);
                return Results.Ok(store);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve store. StoreId: {StoreId}", store_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber, int pageSize, IStoreService service) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var result = await service.SearchStoresAsync(searchTerm, pageNumber, pageSize);

                logger.Info("Retrieved search stores successfully with SearchTerm: {SearchTerm}", searchTerm);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to search store with SearchTerm: {SearchTerm}", searchTerm);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapPost("/", async (
            Store store,
            IStoreService service) =>
        {
            try
            {
                var result = await service.AddStoreAsync(store);

                if (!result)
                {
                    logger.Warn("Store not created.");
                    return Results.BadRequest();
                }

                return Results.Created($"/stores/{store.store_id}", store);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to create store.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapPut("/{store_id}", async (
            string store_id,
            Store store,
            IStoreService service) =>
        {
            try
            {
                if (store_id != store.store_id)
                    return Results.BadRequest("Store ID mismatch.");

                var result = await service.UpdateStoreAsync(store);

                if (!result)
                {
                    logger.Warn("Store not found. StoreId: {StoreId}", store_id);
                    return Results.NotFound();
                }

                return Results.NoContent();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to update store. StoreId: {StoreId}", store_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapDelete("/{store_id}", async (
            string store_id,
            IStoreService service) =>
        {
            try
            {
                var result = await service.DeleteStoreAsync(store_id);

                if (!result)
                {
                    logger.Warn("Store not found. StoreId: {StoreId}", store_id);
                    return Results.NotFound();
                }

                return Results.NoContent();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to delete store. StoreId: {StoreId}", store_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        return app;
    }
}