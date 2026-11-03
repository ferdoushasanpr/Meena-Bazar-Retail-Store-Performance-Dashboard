using Server.Models;

namespace Server.Interfaces;

public interface ICustomerService
{
    Task<PaginatedResponse<Customer>> GetAllCustomersAsync(int pageNumber, int pageSize);
    Task<Customer?> GetCustomerByIdAsync(string customer_id);
    Task<bool> AddCustomerAsync(Customer customer);
    Task<bool> UpdateCustomerAsync(Customer customer);
    Task<bool> DeleteCustomerAsync(string customer_id);
}