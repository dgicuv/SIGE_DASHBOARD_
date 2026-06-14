using Microsoft.EntityFrameworkCore;

namespace SIGE.Dashboard;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Region> Regiones { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Region>(e =>
        {
            e.ToTable("_regiones");
            e.HasKey(r => r.Id);
            e.Property(r => r.Name).HasColumnName("name").HasMaxLength(50).IsRequired();
            e.Property(r => r.CreatedAt).HasColumnName("created_at");
            e.Property(r => r.CreatedBy).HasColumnName("created_by").HasMaxLength(50);
            e.Property(r => r.UpdatedAt).HasColumnName("updated_at");
            e.Property(r => r.UpdatedBy).HasColumnName("updated_by").HasMaxLength(50);
            e.Property(r => r.IsActive).HasColumnName("is_active");
        });
    }
}
