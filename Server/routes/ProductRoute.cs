using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class ProductRoute
{
    public static IEndpointRouteBuilder MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/products").WithTags("Products");

        group.MapGet("/", async (int pageNumber = 1, int pageSize = 10, IProductService service = null!) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var products = await service.GetAllProductsAsync(pageNumber, pageSize);
                return Results.Ok(products);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/{product_id}", async (
            string product_id,
            IProductService service) =>
        {
            try
            {
                var product = await service.GetProductByIdAsync(product_id);

                return product is not null
                    ? Results.Ok(product)
                    : Results.NotFound();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber = 1, int pageSize = 10, IProductService service = null!) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var result = await service.SearchProductsAsync(searchTerm, pageNumber, pageSize);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapPost("/", async (
            Product product,
            IProductService service) =>
        {
            try
            {
                var result = await service.AddProductAsync(product);

                return result
                    ? Results.Created($"/products/{product.product_id}", product)
                    : Results.BadRequest();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapPut("/{product_id}", async (
            string product_id,
            Product product,
            IProductService service) =>
        {
            try
            {
                if (product_id != product.product_id)
                    return Results.BadRequest("Product ID mismatch.");

                var result = await service.UpdateProductAsync(product);

                return result ? Results.NoContent() : Results.NotFound();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapDelete("/{product_id}", async (
            string product_id,
            IProductService service) =>
        {
            try
            {
                var result = await service.DeleteProductAsync(product_id);

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