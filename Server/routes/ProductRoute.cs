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
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var products = await service.GetAllProductsAsync(pageNumber, pageSize);

                logger.Info("Retrieved products. PageNumber: {PageNumber}, PageSize: {PageSize}, TotalRecords: {TotalRecords}", pageNumber, pageSize, products.TotalRecords);
                return Results.Ok(products);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve all products.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/{product_id}", async (
            string product_id,
            IProductService service) =>
        {
            try
            {
                var product = await service.GetProductByIdAsync(product_id);

                if (product is null)
                {
                    logger.Warn("No product found. ProductId: {ProductId}", product_id);
                    return Results.NotFound("No Product Found.");
                }

                logger.Info("Retrieved product successfully. {ProductId}", product_id);
                return Results.Ok(product);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve product. ProductId: {ProductId}", product_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber = 1, int pageSize = 10, IProductService service = null!) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var result = await service.SearchProductsAsync(searchTerm, pageNumber, pageSize);

                logger.Info("Retrieved search products successfully with SearchTerm: {SearchTerm}", searchTerm);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to search product with SearchTerm: {SearchTerm}", searchTerm);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapPost("/", async (
            Product product,
            IProductService service) =>
        {
            try
            {
                var result = await service.AddProductAsync(product);

                if (!result)
                {
                    logger.Warn("Product not created.");
                    return Results.BadRequest();
                }

                return Results.Created($"/products/{product.product_id}", product);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to create product.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
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

                if (!result)
                {
                    logger.Warn("Product not found. ProductId: {ProductId}", product_id);
                    return Results.NotFound("No Product Found.");
                }

                return Results.NoContent();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to update product. ProductId: {ProductId}", product_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapDelete("/{product_id}", async (
            string product_id,
            IProductService service) =>
        {
            try
            {
                var result = await service.DeleteProductAsync(product_id);

                if (!result)
                {
                    logger.Warn("Product not found. ProductId: {ProductId}", product_id);
                    return Results.NotFound("No Product Found.");
                }

                return Results.NoContent();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to delete product. ProductId: {ProductId}", product_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        return app;
    }
}