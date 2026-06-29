namespace SIGE.Dashboard;

public class GetDistribucionPorModalidadHandler(IProgramasEducativosRepository repository)
{
    public Task<IEnumerable<DistribucionProgramasDto>> HandleAsync(int? idRegion, int? idDependencia) =>
        repository.GetDistribucionPorModalidadAsync(idRegion, idDependencia);
}
