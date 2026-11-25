using Microsoft.EntityFrameworkCore;
using NLog;
using Server.Data;
using Server.DTOs;
using Server.Interfaces;
using Server.Models;

namespace Server.Services;

public class SaleService : ISaleService
{
    private readonly ApplicationDbContext _context;
    private readonly Logger logger = LogManager.GetCurrentClassLogger();

    public SaleService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<Sale>> GetAllSalesAsync(int pageNumber = 1, int pageSize = 10)
    {
        try
        {
            var query = _context.DemoSales.AsNoTracking();

            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            var sales = await query
                .OrderByDescending(s => s.order_id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<Sale>
            {
                Data = sales,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = totalPages
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all orders. PageNumber: {PageNumber}, PageSize: {PageSize}");
            throw;
        }
    }

    public async Task<Sale?> GetSaleByIdAsync(string order_id)
    {
        try
        {
            return await _context.DemoSales
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.order_id == order_id);
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to retrieve order. OrderId: {OrderId}",
                order_id);
            throw;
        }
    }

    public async Task<PaginatedResponse<Sale>> SearchSalesAsync(string? searchTerm, int pageNumber = 1, int pageSize = 10)
    {
        try
        {
            var query = _context.DemoSales.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.Trim();

                query = query.Where(s =>
                    s.order_id.Contains(searchTerm) ||
                    s.order_datetime.ToString().Contains(searchTerm) ||
                    s.store_id.Contains(searchTerm) ||
                    (s.customer_id != null && s.customer_id.Contains(searchTerm)) ||
                    s.order_channel.Contains(searchTerm) ||
                    s.payment_method.Contains(searchTerm) ||
                    s.order_status.Contains(searchTerm) ||
                    s.subtotal.ToString().Contains(searchTerm) ||
                    s.discount_total.ToString().Contains(searchTerm) ||
                    s.vat_total.ToString().Contains(searchTerm) ||
                    s.delivery_fee.ToString().Contains(searchTerm) ||
                    s.total_amount.ToString().Contains(searchTerm)
                );
            }

            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            var sales = await query
                .OrderByDescending(s => s.order_id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<Sale>
            {
                Data = sales,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = totalPages
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to search orders. SearchTerm: {SearchTerm}",
                searchTerm);
            throw;
        }
    }

    public async Task<bool> AddSaleAsync(Sale sale)
    {
        try
        {
            await _context.DemoSales.AddAsync(sale);
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("Order created successfully.");
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to create order.");
            throw;
        }
    }

    public async Task<bool> UpdateSaleAsync(OrderRequest sale)
    {
        try
        {
            var existingSale = await _context.DemoSales
                .FirstOrDefaultAsync(s => s.order_id == sale.order_id);

            if (existingSale == null)
                return false;

            existingSale.store_id = sale.store_id;
            existingSale.customer_id = sale.customer_id;
            existingSale.order_channel = sale.order_channel;
            existingSale.payment_method = sale.payment_method;
            existingSale.order_status = sale.order_status;

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("Order updated successfully. OrderId: {OrderId}", sale.order_id);
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to update order. OrderId: {OrderId}", sale.order_id);
            throw;
        }
    }

    public async Task<bool> DeleteSaleAsync(string order_id)
    {
        try
        {
            var sale = await _context.DemoSales
                .FirstOrDefaultAsync(s => s.order_id == order_id);

            if (sale == null)
                return false;

            _context.DemoSales.Remove(sale);
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("Order deleted successfully. OrderId: {OrderId}", sale.order_id);
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to delete order. OrderId: {OrderId}",
                order_id);
            throw;
        }
    }
}