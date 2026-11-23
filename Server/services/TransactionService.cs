using Microsoft.EntityFrameworkCore;
using NLog;
using Server.Data;
using Server.Interfaces;
using Server.Models;

namespace Server.Services;

public class TransactionService : ITransactionService
{
    private readonly ApplicationDbContext _context;
    private readonly Logger logger = LogManager.GetCurrentClassLogger();

    public TransactionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<Transaction>> GetAllTransactionsAsync(int pageNumber = 1, int pageSize = 10)
    {
        try
        {
            var query = _context.DemoTransactions.AsNoTracking();

            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            var transactions = await query
                .OrderByDescending(t => t.order_item_id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<Transaction>
            {
                Data = transactions,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = totalPages
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to retrieve all transactions. PageNumber: {PageNumber}, PageSize: {PageSize}", pageNumber, pageSize);
            throw;
        }
    }

    public async Task<Transaction?> GetTransactionByIdAsync(string order_item_id)
    {
        try
        {
            return await _context.DemoTransactions
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.order_item_id == order_item_id);
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to retrieve transaction. Order_Item_Id: {Order_Item_Id}",
                order_item_id);
            throw;
        }
    }

    public async Task<PaginatedResponse<Transaction>> SearchTransactionsAsync(string? searchTerm, int pageNumber = 1, int pageSize = 10)
    {
        try
        {
            var query = _context.DemoTransactions.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.Trim();

                query = query.Where(t =>
                    t.order_item_id.Contains(searchTerm) ||
                    t.order_id.Contains(searchTerm) ||
                    t.product_id.Contains(searchTerm) ||
                    t.quantity.ToString().Contains(searchTerm) ||
                    t.unit_price.ToString().Contains(searchTerm) ||
                    t.discount_amount.ToString().Contains(searchTerm) ||
                    t.line_net_amount.ToString().Contains(searchTerm) ||
                    t.line_vat_amount.ToString().Contains(searchTerm)
                );
            }

            var totalRecords = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            var transactions = await query
                .OrderByDescending(t => t.order_item_id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<Transaction>
            {
                Data = transactions,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = totalPages
            };
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to search transactions. SearchTerm: {SearchTerm}",
                searchTerm);
            throw;
        }
    }

    public async Task<bool> AddTransactionAsync(Transaction transaction)
    {
        try
        {
            await _context.DemoTransactions.AddAsync(transaction);
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("Order item created successfully.");
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to create order item.");
            throw;
        }
    }

    public async Task<bool> UpdateTransactionAsync(Transaction transaction)
    {
        try
        {
            var existingTransaction = await _context.DemoTransactions
                .FirstOrDefaultAsync(t => t.order_item_id == transaction.order_item_id);

            if (existingTransaction == null)
                return false;

            existingTransaction.order_id = transaction.order_id;
            existingTransaction.product_id = transaction.product_id;
            existingTransaction.quantity = transaction.quantity;
            existingTransaction.unit_price = transaction.unit_price;
            existingTransaction.discount_amount = transaction.discount_amount;
            existingTransaction.line_net_amount = transaction.line_net_amount;
            existingTransaction.line_vat_amount = transaction.line_vat_amount;

            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("Order item updated successfully. Order_item_Id: {Order_item_Id}", transaction.order_item_id);
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex, "Failed to update order item. Order_item_Id: {Order_item_Id}", transaction.order_item_id);
            throw;
        }
    }

    public async Task<bool> DeleteTransactionAsync(string order_item_id)
    {
        try
        {
            var transaction = await _context.DemoTransactions
                .FirstOrDefaultAsync(t => t.order_item_id == order_item_id);

            if (transaction == null)
                return false;

            _context.DemoTransactions.Remove(transaction);
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                logger.Info("Order item deleted successfully. Order_item_Id: {Order_item_Id}", transaction.order_item_id);
            }

            return result;
        }
        catch (Exception ex)
        {
            logger.Error(ex,
                "Failed to delete order item. Order_item_Id: {Order_item_Id}", order_item_id);
            throw;
        }
    }
}