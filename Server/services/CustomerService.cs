using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Interfaces;
using Server.Data;

namespace Server.Services;

public class CustomerService : ICustomerService
{
    private readonly ApplicationDbContext _context;

    public CustomerService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Customer>> GetAllCustomersAsync()
    {
        return await _context.DemoCustomers
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Customer?> GetCustomerByIdAsync(string customer_id)
    {
        return await _context.DemoCustomers
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.customer_id == customer_id);
    }

    public async Task<bool> AddCustomerAsync(Customer customer)
    {
        await _context.DemoCustomers.AddAsync(customer);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateCustomerAsync(Customer customer)
    {
        var existingCustomer = await _context.DemoCustomers
            .FirstOrDefaultAsync(c => c.customer_id == customer.customer_id);

        if (existingCustomer == null)
            return false;

        existingCustomer.first_name = customer.first_name;
        existingCustomer.last_name = customer.last_name;
        existingCustomer.email = customer.email;
        existingCustomer.city = customer.city;
        existingCustomer.signup_date = customer.signup_date;
        existingCustomer.loyalty_tier = customer.loyalty_tier;
        existingCustomer.customer_segment = customer.customer_segment;

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteCustomerAsync(string customer_id)
    {
        var customer = await _context.DemoCustomers
            .FirstOrDefaultAsync(c => c.customer_id == customer_id);

        if (customer == null)
            return false;

        _context.DemoCustomers.Remove(customer);

        return await _context.SaveChangesAsync() > 0;
    }
}