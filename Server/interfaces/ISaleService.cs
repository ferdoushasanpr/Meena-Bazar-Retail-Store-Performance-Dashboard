using Server.Models;

namespace Server.Interfaces;

public interface ISaleService
{
    Task<PaginatedResponse<Sale>> GetAllSalesAsync(int pageNumber, int pageSize);
    Task<Sale?> GetSaleByIdAsync(string order_id);
    Task<PaginatedResponse<Sale>> SearchSalesAsync(string? searchTerm, int pageNumber, int pageSize);
    Task<bool> AddSaleAsync(Sale sale);
    Task<bool> UpdateSaleAsync(Sale sale);
    Task<bool> DeleteSaleAsync(string order_id);
}
