namespace SIGE.Dashboard;

public interface IRegionesRepository
{
    Task<IEnumerable<Region>> GetActiveAsync();
}
