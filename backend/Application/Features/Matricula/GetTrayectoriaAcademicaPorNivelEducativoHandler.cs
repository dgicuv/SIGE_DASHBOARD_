namespace SIGE.Dashboard;

public class GetTrayectoriaAcademicaPorNivelEducativoHandler(IMatriculaRepository repository)
{
    public Task<IEnumerable<TrayectoriaAcademicaPorNivelEducativoDto>> HandleAsync(int? idRegion, int? idDependencia) =>
        repository.GetTrayectoriaAcademicaPorNivelEducativoAsync(idRegion, idDependencia);
}
