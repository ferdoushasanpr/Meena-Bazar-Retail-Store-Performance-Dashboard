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

        group.MapGet("/", async (ICustomerService service) =>
{
    var customers = await service.GetAllCustomersAsync();
    return Results.Ok(customers);
});

        group.MapGet("/{customer_id}", async (
            string customer_id,
            ICustomerService service) =>
        {
            var customer = await service.GetCustomerByIdAsync(customer_id);

            return customer is not null
                ? Results.Ok(customer)
                : Results.NotFound();
        });

        group.MapPost("/", async (
            Customer customer,
            ICustomerService service) =>
        {
            var result = await service.AddCustomerAsync(customer);

            return result
                ? Results.Created($"/customers/{customer.customer_id}", customer)
                : Results.BadRequest();
        });

        group.MapPut("/{customer_id}", async (
            string customer_id,
            Customer customer,
            ICustomerService service) =>
        {
            if (customer_id != customer.customer_id)
                return Results.BadRequest("Customer ID mismatch.");

            var result = await service.UpdateCustomerAsync(customer);

            return result ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/{customer_id}", async (
            string customer_id,
            ICustomerService service) =>
        {
            var result = await service.DeleteCustomerAsync(customer_id);

            return result ? Results.NoContent() : Results.NotFound();
        });

        return app;
    }
}
