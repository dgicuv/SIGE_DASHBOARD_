namespace SIGE.Dashboard;

public interface IMatriculaRepository
{
    Task<IEnumerable<Matricula>> GetAllAsync();
}
