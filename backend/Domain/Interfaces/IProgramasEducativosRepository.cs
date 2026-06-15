namespace SIGE.Dashboard;

public interface IProgramasEducativosRepository
{
    Task<IEnumerable<ProgramaEducativo>> GetActiveAsync();
}
