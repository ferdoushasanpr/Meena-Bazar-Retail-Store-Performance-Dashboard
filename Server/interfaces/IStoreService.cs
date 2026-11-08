using Server.Models;

namespace Server.Interfaces;

public interface IStoreService
{
    Task<IEnumerable<Store>> GetAllStoresAsync();
    Task<PaginatedResponse<Store>> GetPaginatedStoresAsync(int pageNumber, int pageSize);
    Task<Store?> GetStoreByIdAsync(string store_id);
    Task<PaginatedResponse<Store>> SearchStoresAsync(string? searchTerm, int pageNumber, int pageSize);
    Task<bool> AddStoreAsync(Store store);
    Task<bool> UpdateStoreAsync(Store store);
    Task<bool> DeleteStoreAsync(string store_id);
}