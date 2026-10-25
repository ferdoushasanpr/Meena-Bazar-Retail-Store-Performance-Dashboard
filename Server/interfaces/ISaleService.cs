using Server.Models;

namespace Server.Interfaces;

public interface ISaleService
{
    Task<IEnumerable<Sale>> GetAllSalesAsync();
    Task<Sale?> GetSaleByIdAsync(string order_id);
    Task<bool> AddSaleAsync(Sale sale);
    Task<bool> UpdateSaleAsync(Sale sale);
    Task<bool> DeleteSaleAsync(string order_id);
}
