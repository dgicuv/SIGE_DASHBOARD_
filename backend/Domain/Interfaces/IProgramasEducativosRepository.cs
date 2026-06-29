namespace SIGE.Dashboard;

public interface IProgramasEducativosRepository
{
    Task<IEnumerable<ProgramaEducativo>> GetActiveAsync();
    Task<IEnumerable<ProgramaEducativo>> GetActiveAsync(int? idRegion, int? idDependencia);
    Task<IEnumerable<ProgramaEducativo>> GetActiveWithStudentsAsync(int? idRegion, int? idDependencia);
    Task<IEnumerable<DistribucionProgramasDto>> GetDistribucionPorAreaAcademicaAsync(int? idRegion, int? idDependencia);
    Task<IEnumerable<DistribucionProgramasDto>> GetDistribucionPorRegionAsync(int? idRegion, int? idDependencia);
    Task<IEnumerable<DistribucionProgramasDto>> GetDistribucionPorModalidadAsync(int? idRegion, int? idDependencia);
    Task<IEnumerable<DistribucionProgramasDto>> GetDistribucionPorNivelAsync(int? idRegion, int? idDependencia);
}
