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
    var stores = await service.GetAllStoresAsync();
    return Results.Ok(stores);
});

        group.MapGet("/{store_id}", async (
            string store_id,
            IStoreService service) =>
        {
            var store = await service.GetStoreByIdAsync(store_id);

            return store is not null
                ? Results.Ok(store)
                : Results.NotFound();
        });

        group.MapPost("/", async (
            Store store,
            IStoreService service) =>
        {
            var result = await service.AddStoreAsync(store);

            return result
                ? Results.Created($"/stores/{store.store_id}", store)
                : Results.BadRequest();
        });

        group.MapPut("/{store_id}", async (
            string store_id,
            Store store,
            IStoreService service) =>
        {
            if (store_id != store.store_id)
                return Results.BadRequest("Store ID mismatch.");

            var result = await service.UpdateStoreAsync(store);

            return result ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/{store_id}", async (
            string store_id,
            IStoreService service) =>
        {
            var result = await service.DeleteStoreAsync(store_id);

            return result ? Results.NoContent() : Results.NotFound();
        });

        return app;
    }
}