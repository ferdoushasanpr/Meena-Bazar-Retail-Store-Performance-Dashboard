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

    public async Task<PaginatedResponse<Customer>> GetAllCustomersAsync(
    int pageNumber = 1,
    int pageSize = 10)
    {
        var query = _context.DemoCustomers.AsNoTracking();

        var totalRecords = await query.CountAsync();

        var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

        var customers = await query
            .OrderByDescending(c => c.customer_id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResponse<Customer>
        {
            Data = customers,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalRecords = totalRecords,
            TotalPages = totalPages
        };
    }

    public async Task<Customer?> GetCustomerByIdAsync(string customer_id)
    {
        return await _context.DemoCustomers
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.customer_id == customer_id);
    }

    public async Task<PaginatedResponse<Customer>> SearchCustomersAsync(
    string? searchTerm,
    int pageNumber = 1,
    int pageSize = 10)
    {
        var query = _context.DemoCustomers.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            searchTerm = searchTerm.Trim();

            query = query.Where(c =>
                c.customer_id.Contains(searchTerm) ||
                c.first_name.Contains(searchTerm) ||
                c.last_name.Contains(searchTerm) ||
                c.email.Contains(searchTerm) ||
                c.city.Contains(searchTerm) ||
                c.signup_date.ToString().Contains(searchTerm) ||
                c.loyalty_tier.Contains(searchTerm) ||
                c.customer_segment.Contains(searchTerm)
            );
        }

        var totalRecords = await query.CountAsync();

        var totalPages = (int)Math.Ceiling(
            totalRecords / (double)pageSize
        );

        var customers = await query
            .OrderByDescending(c => c.customer_id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResponse<Customer>
        {
            Data = customers,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalRecords = totalRecords,
            TotalPages = totalPages
        };
    }

    public async Task<bool> AddCustomerAsync(Customer customer)
    {
        var lastCustomer = await _context.DemoCustomers
        .OrderByDescending(c => c.customer_id)
        .FirstOrDefaultAsync();

        int nextId = 1;

        if (lastCustomer != null)
        {
            nextId = int.Parse(lastCustomer.customer_id.Substring(4)) + 1;
        }

        customer.customer_id = $"CUST{nextId:D5}";
        customer.loyalty_tier = "Bronze";
        customer.customer_segment = "New Customer";

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