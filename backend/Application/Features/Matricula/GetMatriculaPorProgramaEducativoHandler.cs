namespace SIGE.Dashboard;

public class GetMatriculaPorProgramaEducativoHandler(IMatriculaRepository repository)
{
    public Task<IEnumerable<MatriculaPorProgramaEducativoDto>> HandleAsync(int? idRegion, int? idDependencia) =>
        repository.GetMatriculaPorProgramaEducativoAsync(idRegion, idDependencia);
}
