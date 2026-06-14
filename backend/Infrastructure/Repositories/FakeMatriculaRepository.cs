namespace SIGE.Dashboard;

public class FakeMatriculaRepository : IMatriculaRepository
{
    public Task<IEnumerable<Matricula>> GetAllAsync() =>
        Task.FromResult<IEnumerable<Matricula>>([]);
}
