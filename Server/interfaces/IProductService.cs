using Server.Models;

namespace Server.Interfaces;

public interface IProductService
{
    Task<PaginatedResponse<Product>> GetAllProductsAsync(int pageNumber, int pageSize);
    Task<Product?> GetProductByIdAsync(string product_id);
    Task<PaginatedResponse<Product>> SearchProductsAsync(string? searchTerm, int pageNumber, int pageSize);
    Task<bool> AddProductAsync(Product product);
    Task<bool> UpdateProductAsync(Product product);
    Task<bool> DeleteProductAsync(string product_id);
}