namespace SIGE.Dashboard;

public class FakeRegionesRepository : IRegionesRepository
{
    public Task<IEnumerable<Region>> GetActiveAsync() =>
        Task.FromResult(FakeCatalogData.Regiones.Values.Where(r => r.IsActive));
}
