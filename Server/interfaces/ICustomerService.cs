using Server.Models;

namespace Server.Services;

public interface ICustomerService
{
    Task<IEnumerable<Customer>> GetAllCustomersAsync();
    Task<Customer?> GetCustomerByIdAsync(string customer_id);
    Task<bool> AddCustomerAsync(Customer customer);
    Task<bool> UpdateCustomerAsync(Customer customer);
    Task<bool> DeleteCustomerAsync(string customer_id);
}