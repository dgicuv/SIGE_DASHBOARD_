namespace SIGE.Dashboard;

public class GetActiveProgramasEducativosHandler(IProgramasEducativosRepository repository)
{
    public async Task<IEnumerable<ProgramaEducativoDto>> HandleAsync()
    {
        var programas = await repository.GetActiveAsync();
        return programas.Select(p => new ProgramaEducativoDto(
            p.Id,
            p.Name,
            p.Clave,
            p.ClaveEscuela,
            p.FkIdNivel,
            p.Nivel?.Name ?? string.Empty,
            p.FkIdModalidad,
            p.Modalidad?.Name ?? string.Empty,
            p.FkIdDependencia,
            p.Dependencia?.Clave ?? string.Empty,
            p.Dependencia?.Name ?? string.Empty,
            p.Dependencia?.FkIdRegion ?? 0,
            p.Dependencia?.Region?.Name ?? string.Empty,
            p.FkIdAreasConocimiento,
            p.AreaConocimiento?.Name ?? string.Empty,
            p.FkIdAreasAcademicas,
            p.AreaAcademica?.Name ?? string.Empty
        ));
    }
}
