namespace SIGE.Dashboard;

public record MatriculaDto(
    int IdProgramaEducativo,
    string ProgramaName,
    string ProgramaClave,
    string ProgramaClaveEscuela,
    int EgresadosHombres,
    int EgresadosMujeres,
    int TituladosHombres,
    int TituladosMujeres,
    int MovilidadHaciaAfueraHombres,
    int MovilidadHaciaAfueraMujeres,
    int MovilidadHaciaAdentroHombres,
    int MovilidadHaciaAdentroMujeres,
    int PrimerIngresoHombres,
    int PrimerIngresoMujeres,
    int MatriculaHombres,
    int MatriculaMujeres,
    int NoBinarioHombres,
    int NoBinarioMujeres,
    int DiscapacidadHombres,
    int DiscapacidadMujeres,
    int LenguaIndigenaHombres,
    int LenguaIndigenaMujeres
);
