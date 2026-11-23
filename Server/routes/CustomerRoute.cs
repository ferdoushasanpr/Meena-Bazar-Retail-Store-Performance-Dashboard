using NLog;
using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class CustomerRoute
{
    public static readonly Logger logger = LogManager.GetCurrentClassLogger();
    public static IEndpointRouteBuilder MapCustomerEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/customers")
            .WithTags("Customers").RequireAuthorization();

        group.MapGet("/", async (int pageNumber = 1,
            int pageSize = 10, ICustomerService service = null!) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1 || pageSize > 100)
                    return Results.BadRequest("Invalid pagination parameters.");

                var customers = await service.GetAllCustomersAsync(pageNumber, pageSize);

                logger.Info("Retrieved customers. PageNumber: {PageNumber}, PageSize: {PageSize}, TotalRecords: {TotalRecords}", pageNumber, pageSize, customers.TotalRecords);
                return Results.Ok(customers);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve all customers.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/{customer_id}", async (
            string customer_id,
            ICustomerService service) =>
        {
            try
            {
                var customer = await service.GetCustomerByIdAsync(customer_id);

                if (customer is null)
                {
                    logger.Warn("No customer found. CustomerId: {CustomerId}", customer_id);
                    return Results.NotFound("No Customer Found.");
                }

                logger.Info("Retrieved customer successfully. {CustomerId}", customer_id);
                return Results.Ok(customer);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to retrieve customer. CustomerId: {CustomerId}", customer_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber = 1, int pageSize = 10, ICustomerService service = null!) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var result = await service.SearchCustomersAsync(searchTerm, pageNumber, pageSize);

                logger.Info("Retrieved search customers successfully with SearchTerm: {SearchTerm}", searchTerm);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to search customer with SearchTerm: {SearchTerm}", searchTerm);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapPost("/", async (
            Customer customer,
            ICustomerService service) =>
        {
            try
            {
                var result = await service.AddCustomerAsync(customer);

                if (!result)
                {
                    logger.Warn("Customer not created.");
                    return Results.BadRequest();
                }

                return Results.Created($"/customers/{customer.customer_id}", customer);
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to create customer.");
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapPut("/{customer_id}", async (
            string customer_id,
            Customer customer,
            ICustomerService service) =>
        {
            try
            {
                if (customer_id != customer.customer_id)
                    return Results.BadRequest("Customer ID mismatch.");

                var result = await service.UpdateCustomerAsync(customer);

                if (!result)
                {
                    logger.Warn("Customer not found. CustomerId: {CustomerId}", customer_id);
                    return Results.NotFound("No Customer Found.");
                }

                return Results.NoContent();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to update customer. CustomerId: {CustomerId}", customer_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        group.MapDelete("/{customer_id}", async (
            string customer_id,
            ICustomerService service) =>
        {
            try
            {
                var result = await service.DeleteCustomerAsync(customer_id);

                if (!result)
                {
                    logger.Warn("Customer not found. CustomerId: {CustomerId}", customer_id);
                    return Results.NotFound("No Customer Found.");
                }

                return Results.NoContent();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Something went wrong to delete customer. CustomerId: {CustomerId}", customer_id);
                return Results.Problem(
                    "An unexpected error occurred.",
                    statusCode: 500);
            }
        });

        return app;
    }
}
