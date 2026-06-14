namespace SIGE.Dashboard;

public class GetActiveDependenciasHandler(IDependenciasRepository repository)
{
    public async Task<IEnumerable<DependenciaDto>> HandleAsync()
    {
        var dependencias = await repository.GetActiveAsync();
        return dependencias.Select(d => new DependenciaDto(d.Id, d.Clave, d.Name, d.FkIdRegion, d.Region?.Name ?? string.Empty));
    }
}
