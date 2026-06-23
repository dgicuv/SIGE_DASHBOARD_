namespace SIGE.Dashboard;

public class GetMovilidadPorNivelEducativoHandler(IMatriculaRepository repository)
{
    public Task<IEnumerable<MovilidadPorNivelEducativoDto>> HandleAsync(int? idRegion, int? idDependencia) =>
        repository.GetMovilidadPorNivelEducativoAsync(idRegion, idDependencia);
}
