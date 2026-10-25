using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interfaces;
using Server.Models;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;

    public ProductService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _context.DemoProducts
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Product?> GetProductByIdAsync(string product_id)
    {
        return await _context.DemoProducts
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.product_id == product_id);
    }

    public async Task<bool> AddProductAsync(Product product)
    {
        await _context.DemoProducts.AddAsync(product);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateProductAsync(Product product)
    {
        var existingProduct = await _context.DemoProducts
            .FirstOrDefaultAsync(p => p.product_id == product.product_id);

        if (existingProduct == null)
            return false;

        existingProduct.product_name = product.product_name;
        existingProduct.category = product.category;
        existingProduct.brand = product.brand;
        existingProduct.unit_cost = product.unit_cost;
        existingProduct.unit_price = product.unit_price;
        existingProduct.vat_rate = product.vat_rate;

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteProductAsync(string product_id)
    {
        var product = await _context.DemoProducts
            .FirstOrDefaultAsync(p => p.product_id == product_id);

        if (product == null)
            return false;

        _context.DemoProducts.Remove(product);

        return await _context.SaveChangesAsync() > 0;
    }
}