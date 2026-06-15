namespace SIGE.Dashboard;

public class GetDiscapacidadPorAreaAcademicaHandler(IMatriculaRepository repository)
{
    public Task<IEnumerable<DiscapacidadPorAreaAcademicaDto>> HandleAsync(int? idRegion, int? idDependencia) =>
        repository.GetDiscapacidadPorAreaAcademicaAsync(idRegion, idDependencia);
}
