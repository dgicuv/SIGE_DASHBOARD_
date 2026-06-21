namespace SIGE.Dashboard;

public class GetHablantesLenguaIndigenaHandler(IMatriculaRepository repository)
{
    public Task<IEnumerable<HablantesLenguaIndigenaDto>> HandleAsync(int? idRegion, int? idDependencia) =>
        repository.GetHablantesLenguaIndigenaAsync(idRegion, idDependencia);
}
