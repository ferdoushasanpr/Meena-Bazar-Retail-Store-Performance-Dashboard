using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class ProductRoute
{
    public static IEndpointRouteBuilder MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/products").WithTags("Products");

        group.MapGet("/", async (int pageNumber, int pageSize, IProductService service) =>
        {
            var products = await service.GetAllProductsAsync(pageNumber, pageSize);
            return Results.Ok(products);
        });

        group.MapGet("/{product_id}", async (
            string product_id,
            IProductService service) =>
        {
            var product = await service.GetProductByIdAsync(product_id);

            return product is not null
                ? Results.Ok(product)
                : Results.NotFound();
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber, int pageSize, IProductService service) =>
        {
            if (pageNumber < 1 || pageSize < 1)
                return Results.BadRequest("Invalid pagination parameters.");

            var result = await service.SearchProductsAsync(searchTerm, pageNumber, pageSize);

            return Results.Ok(result);
        });

        group.MapPost("/", async (
            Product product,
            IProductService service) =>
        {
            var result = await service.AddProductAsync(product);

            return result
                ? Results.Created($"/products/{product.product_id}", product)
                : Results.BadRequest();
        });

        group.MapPut("/{product_id}", async (
            string product_id,
            Product product,
            IProductService service) =>
        {
            if (product_id != product.product_id)
                return Results.BadRequest("Product ID mismatch.");

            var result = await service.UpdateProductAsync(product);

            return result ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/{product_id}", async (
            string product_id,
            IProductService service) =>
        {
            var result = await service.DeleteProductAsync(product_id);

            return result ? Results.NoContent() : Results.NotFound();
        });

        return app;
    }
}