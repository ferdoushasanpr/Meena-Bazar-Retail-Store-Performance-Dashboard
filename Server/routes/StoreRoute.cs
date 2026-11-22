using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class StoreRoute
{
    public static IEndpointRouteBuilder MapStoreEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/stores").WithTags("Stores");

        group.MapGet("/", async (IStoreService service) =>
        {
            try
            {
                var stores = await service.GetAllStoresAsync();
                return Results.Ok(stores);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/paginated", async (int pageNumber = 1, int pageSize = 10, IStoreService service = null!) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var stores = await service.GetPaginatedStoresAsync(pageNumber, pageSize);
                return Results.Ok(stores);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/{store_id}", async (
            string store_id,
            IStoreService service) =>
        {
            try
            {
                var store = await service.GetStoreByIdAsync(store_id);

                return store is not null
                    ? Results.Ok(store)
                    : Results.NotFound();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber, int pageSize, IStoreService service) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var result = await service.SearchStoresAsync(searchTerm, pageNumber, pageSize);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapPost("/", async (
            Store store,
            IStoreService service) =>
        {
            try
            {
                var result = await service.AddStoreAsync(store);

                return result
                    ? Results.Created($"/stores/{store.store_id}", store)
                    : Results.BadRequest();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
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
                return result ? Results.NoContent() : Results.NotFound();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapDelete("/{store_id}", async (
            string store_id,
            IStoreService service) =>
        {
            try
            {
                var result = await service.DeleteStoreAsync(store_id);
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