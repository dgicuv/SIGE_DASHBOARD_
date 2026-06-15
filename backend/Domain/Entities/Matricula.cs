namespace SIGE.Dashboard;

public class Matricula
{
    public int IdProgramaEducativo { get; set; }
    public int EgresadosHombres { get; set; }
    public int EgresadosMujeres { get; set; }
    public int TituladosHombres { get; set; }
    public int TituladosMujeres { get; set; }
    public int MovilidadHaciaAfueraHombres { get; set; }
    public int MovilidadHaciaAfueraMujeres { get; set; }
    public int MovilidadHaciaAdentroHombres { get; set; }
    public int MovilidadHaciaAdentroMujeres { get; set; }
    public int PrimerIngresoHombres { get; set; }
    public int PrimerIngresoMujeres { get; set; }
    public int MatriculaHombres { get; set; }
    public int MatriculaMujeres { get; set; }
    public int DiscapacidadHombres { get; set; }
    public int DiscapacidadMujeres { get; set; }
    public int LenguaIndigenaHombres { get; set; }
    public int LenguaIndigenaMujeres { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = null!;
    public DateTime UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }

    public ProgramaEducativo? ProgramaEducativo { get; set; }
}
