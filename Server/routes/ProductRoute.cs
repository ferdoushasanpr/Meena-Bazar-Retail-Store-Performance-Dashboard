using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class ProductRoute
{
    public static IEndpointRouteBuilder MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/products").WithTags("Products");

        group.MapGet("/", async (IProductService service) =>
{
    var products = await service.GetAllProductsAsync();
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