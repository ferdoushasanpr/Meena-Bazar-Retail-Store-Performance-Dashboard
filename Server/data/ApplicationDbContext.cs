using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
    {
    }

    public DbSet<Customer> DemoCustomers { get; set; }
    public DbSet<Product> DemoProducts { get; set; }
    public DbSet<Store> DemoStores { get; set; }
    public DbSet<Sale> DemoSales { get; set; }
    public DbSet<Transaction> DemoTransactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Customer>()
            .HasKey(c => c.customer_id);

        modelBuilder.Entity<Product>()
            .HasKey(p => p.product_id);

        modelBuilder.Entity<Store>()
            .HasKey(s => s.store_id);

        modelBuilder.Entity<Sale>()
            .HasKey(s => s.order_id);

        modelBuilder.Entity<Transaction>()
            .HasKey(t => t.order_item_id);

        modelBuilder.Entity<Sale>()
            .HasOne<Customer>()
            .WithMany()
            .HasForeignKey(s => s.customer_id)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Sale>()
            .HasOne<Store>()
            .WithMany()
            .HasForeignKey(s => s.store_id)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Transaction>()
            .HasOne<Sale>()
            .WithMany()
            .HasForeignKey(t => t.order_id)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Transaction>()
            .HasOne<Product>()
            .WithMany()
            .HasForeignKey(t => t.product_id)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Customer>().ToTable("DemoCustomers", "dbo");
        modelBuilder.Entity<Product>().ToTable("DemoProducts", "dbo");
        modelBuilder.Entity<Store>().ToTable("DemoStores", "dbo");
        modelBuilder.Entity<Sale>().ToTable("DemoSales", "dbo");
        modelBuilder.Entity<Transaction>().ToTable("DemoTransactions", "dbo");
    }
}