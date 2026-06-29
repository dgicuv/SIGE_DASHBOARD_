namespace SIGE.Dashboard;

public class GetListadoProgramasHandler(IProgramasEducativosRepository repository)
{
    public Task<IEnumerable<ProgramaListadoDto>> HandleAsync(int? idRegion, int? idDependencia) =>
        repository.GetListadoAsync(idRegion, idDependencia);
}
