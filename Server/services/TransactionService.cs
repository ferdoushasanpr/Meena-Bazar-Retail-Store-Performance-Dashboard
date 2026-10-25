using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interfaces;
using Server.Models;

namespace Server.Services;

public class TransactionService : ITransactionService
{
    private readonly ApplicationDbContext _context;

    public TransactionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Transaction>> GetAllTransactionsAsync()
    {
        return await _context.DemoTransactions
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Transaction?> GetTransactionByIdAsync(string order_item_id)
    {
        return await _context.DemoTransactions
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.order_item_id == order_item_id);
    }

    public async Task<bool> AddTransactionAsync(Transaction transaction)
    {
        await _context.DemoTransactions.AddAsync(transaction);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateTransactionAsync(Transaction transaction)
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

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteTransactionAsync(string order_item_id)
    {
        var transaction = await _context.DemoTransactions
            .FirstOrDefaultAsync(t => t.order_item_id == order_item_id);

        if (transaction == null)
            return false;

        _context.DemoTransactions.Remove(transaction);

        return await _context.SaveChangesAsync() > 0;
    }
}