using Microsoft.EntityFrameworkCore;
using Top4Arena.Api.Models.Entities;

namespace Top4Arena.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>()
            .HasKey(u => u.Id);
    }
}
