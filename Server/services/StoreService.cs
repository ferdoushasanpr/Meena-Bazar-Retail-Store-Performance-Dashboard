using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interfaces;
using Server.Models;

namespace Server.Services;

public class StoreService : IStoreService
{
    private readonly ApplicationDbContext _context;

    public StoreService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Store>> GetAllStoresAsync()
    {
        return await _context.DemoStores
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Store?> GetStoreByIdAsync(string store_id)
    {
        return await _context.DemoStores
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.store_id == store_id);
    }

    public async Task<bool> AddStoreAsync(Store store)
    {
        await _context.DemoStores.AddAsync(store);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateStoreAsync(Store store)
    {
        var existingStore = await _context.DemoStores
            .FirstOrDefaultAsync(s => s.store_id == store.store_id);

        if (existingStore == null)
            return false;

        existingStore.store_name = store.store_name;
        existingStore.city = store.city;

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteStoreAsync(string store_id)
    {
        var store = await _context.DemoStores
            .FirstOrDefaultAsync(s => s.store_id == store_id);

        if (store == null)
            return false;

        _context.DemoStores.Remove(store);

        return await _context.SaveChangesAsync() > 0;
    }
}