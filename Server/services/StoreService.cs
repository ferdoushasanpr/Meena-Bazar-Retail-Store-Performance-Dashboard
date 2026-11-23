using Microsoft.EntityFrameworkCore;
using NLog;
using Server.Data;
using Server.Interfaces;
using Server.Models;

namespace Server.Services;

public class StoreService : IStoreService
{
    private readonly ApplicationDbContext _context;
    private readonly Logger logger = LogManager.GetCurrentClassLogger();

    public StoreService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Store>> GetAllStoresAsync()
    {
        try
        {
            return await _context.DemoStores
                .AsNoTracking()
                .ToListAsync();
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all stores.");
            throw;
        }
    }

    public async Task<PaginatedResponse<Store>> GetPaginatedStoresAsync(
    int pageNumber = 1,
    int pageSize = 10)
    {
        try
        {
            var query = _context.DemoStores.AsNoTracking();

            var totalRecords = await query.CountAsync();

            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            var stores = await query
                .OrderByDescending(s => s.store_id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<Store>
            {
                Data = stores,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = totalPages
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to retrieve paginated stores. PageNumber: {PageNumber}, PageSize: {PageSize}",
                pageNumber, pageSize);

            throw;
        }
    }

    public async Task<Store?> GetStoreByIdAsync(string store_id)
    {
        try
        {
            return await _context.DemoStores
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.store_id == store_id);
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to retrieve store. StoreId: {StoreId}",
                store_id);

            throw;
        }
    }

    public async Task<PaginatedResponse<Store>> SearchStoresAsync(string? searchTerm, int pageNumber = 1, int pageSize = 10)
    {
        try
        {
            var query = _context.DemoStores.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.Trim();

                query = query.Where(s =>
                    s.store_id.Contains(searchTerm) ||
                    s.store_name.Contains(searchTerm) ||
                    s.city.Contains(searchTerm)
                );
            }

            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            var stores = await query
                .OrderByDescending(s => s.store_id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<Store>
            {
                Data = stores,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = totalPages
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to search stores. SearchTerm: {SearchTerm}",
                searchTerm);

            throw;
        }
    }

    public async Task<bool> AddStoreAsync(Store store)
    {
        try
        {
            var lastStore = await _context.DemoStores
            .OrderByDescending(s => s.store_id)
            .FirstOrDefaultAsync();

            int nextId = 1;

            if (lastStore != null)
            {
                nextId = int.Parse(lastStore.store_id.Substring(2)) + 1;
            }

            store.store_id = $"ST{nextId:D3}";

            await _context.DemoStores.AddAsync(store);
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("Store created successfully. StoreId: {StoreId}", store.store_id);
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to create store. StoreId: {StoreId}",
                store.store_id);

            throw;
        }
    }

    public async Task<bool> UpdateStoreAsync(Store store)
    {
        try
        {
            var existingStore = await _context.DemoStores
                .FirstOrDefaultAsync(s => s.store_id == store.store_id);

            if (existingStore == null)
                return false;

            existingStore.store_name = store.store_name;
            existingStore.city = store.city;

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("Store updated successfully. StoreId: {StoreId}", store.store_id);
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to update store. StoreId: {StoreId}",
                store.store_id);

            throw;
        }
    }

    public async Task<bool> DeleteStoreAsync(string store_id)
    {
        try
        {
            var store = await _context.DemoStores
                .FirstOrDefaultAsync(s => s.store_id == store_id);

            if (store == null)
                return false;

            _context.DemoStores.Remove(store);

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("Store deleted successfully. StoreId: {StoreId}", store_id);
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to delete store. StoreId: {StoreId}",
                store_id);

            throw;
        }
    }
}