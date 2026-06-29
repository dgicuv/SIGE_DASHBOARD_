namespace SIGE.Dashboard;

public class GetDistribucionPorRegionHandler(IProgramasEducativosRepository repository)
{
    public Task<IEnumerable<DistribucionProgramasDto>> HandleAsync(int? idRegion, int? idDependencia) =>
        repository.GetDistribucionPorRegionAsync(idRegion, idDependencia);
}
