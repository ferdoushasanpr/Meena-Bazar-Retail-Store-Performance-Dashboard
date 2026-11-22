using Server.Interfaces;
using Server.Models;

namespace Server.Routes;

public static class CustomerRoute
{
    public static IEndpointRouteBuilder MapCustomerEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/customers")
            .WithTags("Customers");

        group.MapGet("/", async (int pageNumber = 1,
            int pageSize = 10, ICustomerService service = null!) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1 || pageSize > 100)
                    return Results.BadRequest("Invalid pagination parameters.");

                var customers = await service.GetAllCustomersAsync(pageNumber, pageSize);
                return Results.Ok(customers);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/{customer_id}", async (
            string customer_id,
            ICustomerService service) =>
        {
            try
            {
                var customer = await service.GetCustomerByIdAsync(customer_id);

                return customer is not null
                    ? Results.Ok(customer)
                    : Results.NotFound("No Customer Found.");
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapGet("/search", async (string? searchTerm, int pageNumber = 1, int pageSize = 10, ICustomerService service = null!) =>
        {
            try
            {
                if (pageNumber < 1 || pageSize < 1)
                    return Results.BadRequest("Invalid pagination parameters.");

                var result = await service.SearchCustomersAsync(searchTerm, pageNumber, pageSize);

                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapPost("/", async (
            Customer customer,
            ICustomerService service) =>
        {
            try
            {
                var result = await service.AddCustomerAsync(customer);

                return result
                    ? Results.Created($"/customers/{customer.customer_id}", customer)
                    : Results.BadRequest();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
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

                return result ? Results.NoContent() : Results.NotFound("No Customer Found.");
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        group.MapDelete("/{customer_id}", async (
            string customer_id,
            ICustomerService service) =>
        {
            try
            {
                var result = await service.DeleteCustomerAsync(customer_id);

                return result ? Results.NoContent() : Results.NotFound("No Customer Found.");
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        });

        return app;
    }
}
