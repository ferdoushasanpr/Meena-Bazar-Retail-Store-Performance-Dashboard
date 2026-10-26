using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Interfaces;
using Server.Routes;
using Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' was not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IStoreService, StoreService>();
builder.Services.AddScoped<ISaleService, SaleService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/openapi/v1.json",
            "Retail Store API v1");
    });
}

app.UseHttpsRedirection();

// ==================== CUSTOMER ENDPOINTS ====================
app.MapCustomerEndpoints();

// ==================== PRODUCT ENDPOINTS ====================
app.MapProductEndpoints();

// ==================== STORE ENDPOINTS ====================
app.MapStoreEndpoints();

// ==================== SALE ENDPOINTS ====================
app.MapSaleEndpoints();

// ==================== TRANSACTION ENDPOINTS ====================
app.MapTransactionEndpoints();


app.Run();