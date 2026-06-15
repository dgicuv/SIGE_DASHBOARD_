namespace SIGE.Dashboard;

public class ProgramaEducativo
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Clave { get; set; } = null!;
    public string ClaveEscuela { get; set; } = null!;
    public int FkIdNivel { get; set; }
    public int FkIdModalidad { get; set; }
    public int FkIdDependencia { get; set; }
    public int FkIdAreasConocimiento { get; set; }
    public int FkIdAreasAcademicas { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsActive { get; set; }

    public Nivel? Nivel { get; set; }
    public Modalidad? Modalidad { get; set; }
    public Dependencia? Dependencia { get; set; }
    public AreaConocimiento? AreaConocimiento { get; set; }
    public AreaAcademica? AreaAcademica { get; set; }
}
