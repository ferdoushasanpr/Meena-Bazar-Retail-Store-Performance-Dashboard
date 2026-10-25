using Server.Models;

namespace Server.Interfaces;

public interface ITransactionService
{
    Task<IEnumerable<Transaction>> GetAllTransactionsAsync();
    Task<Transaction?> GetTransactionByIdAsync(string order_item_id);
    Task<bool> AddTransactionAsync(Transaction transaction);
    Task<bool> UpdateTransactionAsync(Transaction transaction);
    Task<bool> DeleteTransactionAsync(string order_item_id);
}
