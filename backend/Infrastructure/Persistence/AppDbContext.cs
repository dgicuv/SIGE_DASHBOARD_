using Microsoft.EntityFrameworkCore;

namespace SIGE.Dashboard;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Region> Regiones { get; set; }
    public DbSet<Dependencia> Dependencias { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Dependencia>(e =>
        {
            e.ToTable("_dependencias");
            e.HasKey(d => d.Id);
            e.Property(d => d.Clave).HasColumnName("clave").HasMaxLength(20).IsRequired();
            e.Property(d => d.Name).HasColumnName("name").HasMaxLength(50).IsRequired();
            e.Property(d => d.FkIdRegion).HasColumnName("fk_id_region");
            e.HasOne(d => d.Region).WithMany().HasForeignKey(d => d.FkIdRegion);
            e.Property(d => d.CreatedAt).HasColumnName("created_at");
            e.Property(d => d.CreatedBy).HasColumnName("created_by").HasMaxLength(50);
            e.Property(d => d.UpdatedAt).HasColumnName("updated_at");
            e.Property(d => d.UpdatedBy).HasColumnName("updated_by").HasMaxLength(50);
            e.Property(d => d.IsActive).HasColumnName("is_active");
        });

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
