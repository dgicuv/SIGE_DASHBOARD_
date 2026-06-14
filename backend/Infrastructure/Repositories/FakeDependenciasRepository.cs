namespace SIGE.Dashboard;

public class FakeDependenciasRepository : IDependenciasRepository
{
    public Task<IEnumerable<Dependencia>> GetActiveAsync()
    {
        var result = FakeCatalogData.Dependencias
            .Where(d => d.IsActive)
            .OrderBy(d => d.Clave)
            .Select(d => { d.Region = FakeCatalogData.Regiones[d.FkIdRegion]; return d; });

        return Task.FromResult<IEnumerable<Dependencia>>(result);
    }
}
