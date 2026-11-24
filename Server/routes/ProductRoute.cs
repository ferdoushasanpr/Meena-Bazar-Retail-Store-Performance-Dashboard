using NLog;
using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class ProductRoute
{
    public static readonly Logger logger = LogManager.GetCurrentClassLogger();
    public static IEndpointRouteBuilder MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/products").WithTags("Products").RequireAuthorization();

        group.MapGet("/", async (int pageNumber = 1, int pageSize = 10, IProductService service = null!) =>
        {
            if (pageNumber < 1 || pageSize < 1)
                return Results.BadRequest("Invalid pagination parameters.");

            var products = await service.GetAllProductsAsync(pageNumber, pageSize);

            logger.Info("Retrieved products. PageNumber: {PageNumber}, PageSize: {PageSize}, TotalRecords: {TotalRecords}", pageNumber, pageSize, products.TotalRecords);
            return Results.Ok(products);
        });

        group.MapGet("/{product_id}", async (
            string product_id,
            IProductService service) =>
        {
            var product = await service.GetProductByIdAsync(product_id);

            if (product is null)
            {
                logger.Warn("No product found. ProductId: {ProductId}", product_id);
                return Results.NotFound("No Product Found.");
            }

            logger.Info("Retrieved product successfully. {ProductId}", product_id);
            return Results.Ok(product);
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber = 1, int pageSize = 10, IProductService service = null!) =>
        {
            if (pageNumber < 1 || pageSize < 1)
                return Results.BadRequest("Invalid pagination parameters.");

            var result = await service.SearchProductsAsync(searchTerm, pageNumber, pageSize);

            logger.Info("Retrieved search products successfully with SearchTerm: {SearchTerm}", searchTerm);
            return Results.Ok(result);
        });

        group.MapPost("/", async (
            Product product,
            IProductService service) =>
        {
            var result = await service.AddProductAsync(product);

            if (!result)
            {
                logger.Warn("Product not created.");
                return Results.BadRequest();
            }

            return Results.Created($"/products/{product.product_id}", product);
        });

        group.MapPut("/{product_id}", async (
            string product_id,
            Product product,
            IProductService service) =>
        {
            if (product_id != product.product_id)
                return Results.BadRequest("Product ID mismatch.");

            var result = await service.UpdateProductAsync(product);

            if (!result)
            {
                logger.Warn("Product not found. ProductId: {ProductId}", product_id);
                return Results.NotFound("No Product Found.");
            }

            return Results.NoContent();
        });

        group.MapDelete("/{product_id}", async (
            string product_id,
            IProductService service) =>
        {
            var result = await service.DeleteProductAsync(product_id);

            if (!result)
            {
                logger.Warn("Product not found. ProductId: {ProductId}", product_id);
                return Results.NotFound("No Product Found.");
            }

            return Results.NoContent();
        });

        return app;
    }
}