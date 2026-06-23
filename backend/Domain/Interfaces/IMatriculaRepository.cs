namespace SIGE.Dashboard;

public interface IMatriculaRepository
{
    Task<IEnumerable<Matricula>> GetAllAsync();
    Task<IEnumerable<Matricula>> GetAllAsync(int? idRegion, int? idDependencia);
    Task<IEnumerable<DiscapacidadPorAreaAcademicaDto>> GetDiscapacidadPorAreaAcademicaAsync(int? idRegion, int? idDependencia);
    Task<IEnumerable<HablantesLenguaIndigenaDto>> GetHablantesLenguaIndigenaAsync(int? idRegion, int? idDependencia);
    Task<IEnumerable<MatriculaPorProgramaEducativoDto>> GetMatriculaPorProgramaEducativoAsync(int? idRegion, int? idDependencia);
    Task<IEnumerable<MovilidadPorNivelEducativoDto>> GetMovilidadPorNivelEducativoAsync(int? idRegion, int? idDependencia);
}
