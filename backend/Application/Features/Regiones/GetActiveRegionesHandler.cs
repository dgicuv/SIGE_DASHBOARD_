namespace SIGE.Dashboard;

public class GetActiveRegionesHandler(IRegionesRepository repository)
{
    public async Task<IEnumerable<RegionDto>> HandleAsync()
    {
        var regiones = await repository.GetActiveAsync();
        return regiones.Select(r => new RegionDto(r.Id, r.Name));
    }
}
