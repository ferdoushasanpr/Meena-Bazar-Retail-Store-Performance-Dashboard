using Server.Models;

namespace Server.Interfaces;

public interface IStoreService
{
    Task<IEnumerable<Store>> GetAllStoresAsync();
    Task<Store?> GetStoreByIdAsync(string store_id);
    Task<bool> AddStoreAsync(Store store);
    Task<bool> UpdateStoreAsync(Store store);
    Task<bool> DeleteStoreAsync(string store_id);
}