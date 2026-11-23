using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Interfaces;
using Server.Data;
using NLog;

namespace Server.Services;

public class CustomerService : ICustomerService
{
    private readonly ApplicationDbContext _context;
    private readonly Logger logger = LogManager.GetCurrentClassLogger();

    public CustomerService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<Customer>> GetAllCustomersAsync(
    int pageNumber = 1,
    int pageSize = 10)
    {
        try
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
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all customers. PageNumber: {PageNumber}, PageSize: {PageSize}");
            throw;
        }
    }

    public async Task<Customer?> GetCustomerByIdAsync(string customer_id)
    {
        try
        {
            return await _context.DemoCustomers
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.customer_id == customer_id);
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to retrieve customer. CustomerId: {CustomerId}",
                customer_id);
            throw;
        }
    }

    public async Task<PaginatedResponse<Customer>> SearchCustomersAsync(string? searchTerm, int pageNumber = 1, int pageSize = 10)
    {
        try
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
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to search customers. SearchTerm: {SearchTerm}",
                searchTerm);
            throw;
        }
    }

    public async Task<bool> AddCustomerAsync(Customer customer)
    {
        try
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
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("Customer created successfully. CustomerId: {CustomerId}", customer.customer_id);
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to create customer. CustomerId: {CustomerId}", customer.customer_id);
            throw;
        }
    }

    public async Task<bool> UpdateCustomerAsync(Customer customer)
    {
        try
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

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("Customer updated successfully. CustomerId: {CustomerId}", customer.customer_id);
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to update customer. CustomerId: {CustomerId}", customer.customer_id);
            throw;
        }
    }

    public async Task<bool> DeleteCustomerAsync(string customer_id)
    {
        try
        {
            var customer = await _context.DemoCustomers
            .FirstOrDefaultAsync(c => c.customer_id == customer_id);

            if (customer == null)
                return false;

            _context.DemoCustomers.Remove(customer);
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("Customer deleted successfully. CustomerId: {CustomerId}", customer.customer_id);
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to delete customer. CustomerId: {CustomerId}",
                customer_id);
            throw;
        }
    }
}