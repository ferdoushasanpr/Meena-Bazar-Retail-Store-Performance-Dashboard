using Server.Models;

namespace Server.Interfaces;

public interface ITransactionService
{
    Task<PaginatedResponse<Transaction>> GetAllTransactionsAsync(int pageNumber, int pageSize);
    Task<Transaction?> GetTransactionByIdAsync(string order_item_id);
    Task<bool> AddTransactionAsync(Transaction transaction);
    Task<bool> UpdateTransactionAsync(Transaction transaction);
    Task<bool> DeleteTransactionAsync(string order_item_id);
}
