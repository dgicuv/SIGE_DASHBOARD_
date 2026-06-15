namespace SIGE.Dashboard;

public class GetAllMatriculaHandler(IMatriculaRepository repository)
{
    public async Task<IEnumerable<MatriculaDto>> HandleAsync()
    {
        var matriculas = await repository.GetAllAsync();
        return matriculas.Select(m => new MatriculaDto(
            m.IdProgramaEducativo,
            m.ProgramaEducativo?.Name ?? string.Empty,
            m.ProgramaEducativo?.Clave ?? string.Empty,
            m.ProgramaEducativo?.ClaveEscuela ?? string.Empty,
            m.EgresadosHombres,
            m.EgresadosMujeres,
            m.TituladosHombres,
            m.TituladosMujeres,
            m.MovilidadHaciaAfueraHombres,
            m.MovilidadHaciaAfueraMujeres,
            m.MovilidadHaciaAdentroHombres,
            m.MovilidadHaciaAdentroMujeres,
            m.PrimerIngresoHombres,
            m.PrimerIngresoMujeres,
            m.MatriculaHombres,
            m.MatriculaMujeres,
            m.DiscapacidadHombres,
            m.DiscapacidadMujeres,
            m.LenguaIndigenaHombres,
            m.LenguaIndigenaMujeres
        ));
    }
}
