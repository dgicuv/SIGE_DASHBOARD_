namespace SIGE.Dashboard;

public class GetEstadisticaProgramasEducativosHandler(IProgramasEducativosRepository repository)
{
    public async Task<EstadisticaProgramasEducativosDto> HandleAsync(int? idRegion = null, int? idDependencia = null)
    {
        var programas = await repository.GetActiveWithStudentsAsync(idRegion, idDependencia);

        return new EstadisticaProgramasEducativosDto(
            TotalProgramasEducativos: programas.Select(p => p.Id).Distinct().Count(),
            TotalAreasAcademicas: programas.Select(p => p.FkIdAreasAcademicas).Distinct().Count(),
            TotalModalidades: programas.Select(p => p.FkIdModalidad).Distinct().Count(),
            TotalNiveles: programas.Select(p => p.FkIdNivel).Distinct().Count()
        );
    }
}
