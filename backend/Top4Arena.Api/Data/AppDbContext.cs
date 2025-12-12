using Microsoft.EntityFrameworkCore;
using Top4Arena.Api.Models.Entities;

namespace Top4Arena.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Top4Preset> Top4Presets { get; set; }
    public DbSet<GameSession> GameSessions { get; set; }
    public DbSet<GameToken> GameTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>()
            .HasKey(u => u.Id);

        builder.Entity<Top4Preset>(entity =>
        {
            entity.HasKey(t => t.Id);
            
            entity.HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(t => t.UserId);
        });

        builder.Entity<GameSession>(entity =>
        {
            entity.HasKey(g => g.Id);
            entity.HasOne(g => g.User)
                .WithMany()
                .HasForeignKey(g => g.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(g => g.UserId);
            entity.HasIndex(g => g.PlayedAt);
        });

        builder.Entity<GameToken>(entity =>
        {
            entity.HasKey(g => g.Id);
            
            entity.HasOne(g => g.User)
                .WithMany()
                .HasForeignKey(g => g.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasIndex(g => g.UserId);
            entity.HasIndex(g => g.CreatedAt);
            entity.HasIndex(g => g.ExpiresAt);
            
            // Optional: Index on Used for faster queries
            entity.HasIndex(g => g.Used);
        });
    }
}
