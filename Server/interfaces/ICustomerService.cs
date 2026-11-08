using Server.Models;

namespace Server.Interfaces;

public interface ICustomerService
{
    Task<PaginatedResponse<Customer>> GetAllCustomersAsync(int pageNumber, int pageSize);
    Task<Customer?> GetCustomerByIdAsync(string customer_id);
    Task<PaginatedResponse<Customer>> SearchCustomersAsync(
    string? searchTerm,
    int pageNumber = 1,
    int pageSize = 10);
    Task<bool> AddCustomerAsync(Customer customer);
    Task<bool> UpdateCustomerAsync(Customer customer);
    Task<bool> DeleteCustomerAsync(string customer_id);
}