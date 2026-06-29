namespace SIGE.Dashboard;

public class GetDistribucionPorAreaAcademicaHandler(IProgramasEducativosRepository repository)
{
    public Task<IEnumerable<DistribucionProgramasDto>> HandleAsync(int? idRegion, int? idDependencia) =>
        repository.GetDistribucionPorAreaAcademicaAsync(idRegion, idDependencia);
}
