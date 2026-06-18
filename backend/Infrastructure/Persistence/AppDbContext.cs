using Microsoft.EntityFrameworkCore;

namespace SIGE.Dashboard;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Region> Regiones { get; set; }
    public DbSet<Dependencia> Dependencias { get; set; }
    public DbSet<AreaAcademica> AreasAcademicas { get; set; }
    public DbSet<AreaConocimiento> AreasConocimiento { get; set; }
    public DbSet<Modalidad> Modalidades { get; set; }
    public DbSet<Nivel> Niveles { get; set; }
    public DbSet<ProgramaEducativo> ProgramasEducativos { get; set; }
    public DbSet<Matricula> Matriculas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Matricula>(e =>
        {
            e.ToTable("_matricula");
            e.HasKey(m => m.IdProgramaEducativo);
            e.Property(m => m.IdProgramaEducativo).HasColumnName("id_programa_educativo");
            e.Property(m => m.EgresadosHombres).HasColumnName("egresados_hombres");
            e.Property(m => m.EgresadosMujeres).HasColumnName("egresados_mujeres");
            e.Property(m => m.TituladosHombres).HasColumnName("titulados_hombres");
            e.Property(m => m.TituladosMujeres).HasColumnName("titulados_mujeres");
            e.Property(m => m.MovilidadHaciaAfueraHombres).HasColumnName("movilidad_hacia_afuera_hombres");
            e.Property(m => m.MovilidadHaciaAfueraMujeres).HasColumnName("movilidad_hacia_afuera_mujeres");
            e.Property(m => m.MovilidadHaciaAdentroHombres).HasColumnName("movilidad_hacia_adentro_hombres");
            e.Property(m => m.MovilidadHaciaAdentroMujeres).HasColumnName("movilidad_hacia_adentro_mujeres");
            e.Property(m => m.PrimerIngresoHombres).HasColumnName("primer_ingreso_hombres");
            e.Property(m => m.PrimerIngresoMujeres).HasColumnName("primer_ingreso_mujeres");
            e.Property(m => m.MatriculaHombres).HasColumnName("matricula_hombres");
            e.Property(m => m.MatriculaMujeres).HasColumnName("matricula_mujeres");
            e.Property(m => m.NoBinarioHombres).HasColumnName("no_binario_hombres");
            e.Property(m => m.NoBinarioMujeres).HasColumnName("no_binario_mujeres");
            e.Property(m => m.DiscapacidadHombres).HasColumnName("discapacidad_hombres");
            e.Property(m => m.DiscapacidadMujeres).HasColumnName("discapacidad_mujeres");
            e.Property(m => m.LenguaIndigenaHombres).HasColumnName("lengua_indigena_hombres");
            e.Property(m => m.LenguaIndigenaMujeres).HasColumnName("lengua_indigena_mujeres");
            e.Property(m => m.CreatedAt).HasColumnName("created_at");
            e.Property(m => m.CreatedBy).HasColumnName("created_by").HasMaxLength(50);
            e.Property(m => m.UpdatedAt).HasColumnName("updated_at");
            e.Property(m => m.UpdatedBy).HasColumnName("updated_by").HasMaxLength(50);
            e.HasOne(m => m.ProgramaEducativo).WithOne().HasForeignKey<Matricula>(m => m.IdProgramaEducativo);
        });

        modelBuilder.Entity<AreaAcademica>(e =>
        {
            e.ToTable("_areas_academicas");
            e.HasKey(a => a.Id);
            e.Property(a => a.Name).HasColumnName("name").HasMaxLength(50).IsRequired();
            e.Property(a => a.CreatedAt).HasColumnName("created_at");
            e.Property(a => a.CreatedBy).HasColumnName("created_by").HasMaxLength(50);
            e.Property(a => a.UpdatedAt).HasColumnName("updated_at");
            e.Property(a => a.UpdatedBy).HasColumnName("updated_by").HasMaxLength(50);
            e.Property(a => a.IsActive).HasColumnName("is_active");
        });

        modelBuilder.Entity<ProgramaEducativo>(e =>
        {
            e.ToTable("_programas_educativos");
            e.HasKey(p => p.Id);
            e.Property(p => p.Name).HasColumnName("name").HasMaxLength(150).IsRequired();
            e.Property(p => p.Clave).HasColumnName("clave").HasMaxLength(20).IsRequired();
            e.Property(p => p.ClaveEscuela).HasColumnName("clave_escuela").HasMaxLength(20).IsRequired();
            e.Property(p => p.FkIdNivel).HasColumnName("fk_id_nivel");
            e.Property(p => p.FkIdModalidad).HasColumnName("fk_id_modalidad");
            e.Property(p => p.FkIdDependencia).HasColumnName("fk_id_dependencia");
            e.Property(p => p.FkIdAreasConocimiento).HasColumnName("fk_id_areas_conocimiento");
            e.Property(p => p.FkIdAreasAcademicas).HasColumnName("fk_id_areas_academicas");
            e.Property(p => p.CreatedAt).HasColumnName("created_at");
            e.Property(p => p.CreatedBy).HasColumnName("created_by").HasMaxLength(50);
            e.Property(p => p.UpdatedAt).HasColumnName("updated_at");
            e.Property(p => p.UpdatedBy).HasColumnName("updated_by").HasMaxLength(50);
            e.Property(p => p.IsActive).HasColumnName("is_active");
            e.HasOne(p => p.Nivel).WithMany().HasForeignKey(p => p.FkIdNivel);
            e.HasOne(p => p.Modalidad).WithMany().HasForeignKey(p => p.FkIdModalidad);
            e.HasOne(p => p.Dependencia).WithMany().HasForeignKey(p => p.FkIdDependencia);
            e.HasOne(p => p.AreaConocimiento).WithMany().HasForeignKey(p => p.FkIdAreasConocimiento);
            e.HasOne(p => p.AreaAcademica).WithMany().HasForeignKey(p => p.FkIdAreasAcademicas);
        });

        modelBuilder.Entity<Nivel>(e =>
        {
            e.ToTable("_niveles");
            e.HasKey(n => n.Id);
            e.Property(n => n.Name).HasColumnName("name").HasMaxLength(50).IsRequired();
            e.Property(n => n.CreatedAt).HasColumnName("created_at");
            e.Property(n => n.CreatedBy).HasColumnName("created_by").HasMaxLength(50);
            e.Property(n => n.UpdatedAt).HasColumnName("updated_at");
            e.Property(n => n.UpdatedBy).HasColumnName("updated_by").HasMaxLength(50);
            e.Property(n => n.IsActive).HasColumnName("is_active");
        });

        modelBuilder.Entity<Modalidad>(e =>
        {
            e.ToTable("_modalidades");
            e.HasKey(m => m.Id);
            e.Property(m => m.Name).HasColumnName("name").HasMaxLength(50).IsRequired();
            e.Property(m => m.CreatedAt).HasColumnName("created_at");
            e.Property(m => m.CreatedBy).HasColumnName("created_by").HasMaxLength(50);
            e.Property(m => m.UpdatedAt).HasColumnName("updated_at");
            e.Property(m => m.UpdatedBy).HasColumnName("updated_by").HasMaxLength(50);
            e.Property(m => m.IsActive).HasColumnName("is_active");
        });

        modelBuilder.Entity<AreaConocimiento>(e =>
        {
            e.ToTable("_areas_conocimiento");
            e.HasKey(a => a.Id);
            e.Property(a => a.Name).HasColumnName("name").HasMaxLength(50).IsRequired();
            e.Property(a => a.CreatedAt).HasColumnName("created_at");
            e.Property(a => a.CreatedBy).HasColumnName("created_by").HasMaxLength(50);
            e.Property(a => a.UpdatedAt).HasColumnName("updated_at");
            e.Property(a => a.UpdatedBy).HasColumnName("updated_by").HasMaxLength(50);
            e.Property(a => a.IsActive).HasColumnName("is_active");
        });

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
