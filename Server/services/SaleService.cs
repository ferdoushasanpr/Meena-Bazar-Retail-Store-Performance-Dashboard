using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interfaces;
using Server.Models;

namespace Server.Services;

public class SaleService : ISaleService
{
    private readonly ApplicationDbContext _context;

    public SaleService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<Sale>> GetAllSalesAsync(
    int pageNumber = 1,
    int pageSize = 10)
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

    public async Task<Sale?> GetSaleByIdAsync(string order_id)
    {
        return await _context.DemoSales
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.order_id == order_id);
    }

    public async Task<bool> AddSaleAsync(Sale sale)
    {
        await _context.DemoSales.AddAsync(sale);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateSaleAsync(Sale sale)
    {
        var existingSale = await _context.DemoSales
            .FirstOrDefaultAsync(s => s.order_id == sale.order_id);

        if (existingSale == null)
            return false;

        existingSale.order_datetime = sale.order_datetime;
        existingSale.store_id = sale.store_id;
        existingSale.customer_id = sale.customer_id;
        existingSale.order_channel = sale.order_channel;
        existingSale.payment_method = sale.payment_method;
        existingSale.order_status = sale.order_status;
        existingSale.subtotal = sale.subtotal;
        existingSale.discount_total = sale.discount_total;
        existingSale.vat_total = sale.vat_total;
        existingSale.delivery_fee = sale.delivery_fee;
        existingSale.total_amount = sale.total_amount;

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteSaleAsync(string order_id)
    {
        var sale = await _context.DemoSales
            .FirstOrDefaultAsync(s => s.order_id == order_id);

        if (sale == null)
            return false;

        _context.DemoSales.Remove(sale);

        return await _context.SaveChangesAsync() > 0;
    }
}