using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interfaces;
using Server.Models;

namespace Server.Services;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;

    public ProductService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResponse<Product>> GetAllProductsAsync(
    int pageNumber = 1,
    int pageSize = 10)
    {
        var query = _context.DemoProducts.AsNoTracking();

        var totalRecords = await query.CountAsync();

        var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

        var products = await query
            .OrderByDescending(p => p.product_id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResponse<Product>
        {
            Data = products,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalRecords = totalRecords,
            TotalPages = totalPages
        };
    }

    public async Task<Product?> GetProductByIdAsync(string product_id)
    {
        return await _context.DemoProducts
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.product_id == product_id);
    }

    public async Task<PaginatedResponse<Product>> SearchProductsAsync(string? searchTerm, int pageNumber = 1, int pageSize = 10)
    {
        var query = _context.DemoProducts.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            searchTerm = searchTerm.Trim();

            query = query.Where(p =>
                p.product_id.Contains(searchTerm) ||
                p.product_name.Contains(searchTerm) ||
                p.category.Contains(searchTerm) ||
                p.brand.Contains(searchTerm) ||
                p.unit_cost.ToString().Contains(searchTerm) ||
                p.unit_price.ToString().Contains(searchTerm) ||
                p.vat_rate.ToString().Contains(searchTerm)
            );
        }

        var totalRecords = await query.CountAsync();

        var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

        var products = await query
            .OrderByDescending(p => p.product_id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResponse<Product>
        {
            Data = products,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalRecords = totalRecords,
            TotalPages = totalPages
        };
    }

    public async Task<bool> AddProductAsync(Product product)
    {
        var lastProduct = await _context.DemoProducts
        .OrderByDescending(p => p.product_id)
        .FirstOrDefaultAsync();

        int nextId = 1;

        if (lastProduct != null)
        {
            nextId = int.Parse(lastProduct.product_id.Substring(1)) + 1;
        }

        product.product_id = $"P{nextId:D5}";

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