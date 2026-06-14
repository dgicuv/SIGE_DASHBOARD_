namespace SIGE.Dashboard;

public interface IDependenciasRepository
{
    Task<IEnumerable<Dependencia>> GetActiveAsync();
}
