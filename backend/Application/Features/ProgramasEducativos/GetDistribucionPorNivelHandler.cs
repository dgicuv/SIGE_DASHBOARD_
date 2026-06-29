namespace SIGE.Dashboard;

public class GetDistribucionPorNivelHandler(IProgramasEducativosRepository repository)
{
    public Task<IEnumerable<DistribucionProgramasDto>> HandleAsync(int? idRegion, int? idDependencia) =>
        repository.GetDistribucionPorNivelAsync(idRegion, idDependencia);
}
