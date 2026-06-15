using Microsoft.EntityFrameworkCore;

namespace SIGE.Dashboard;

public class DependenciasRepository(AppDbContext db) : IDependenciasRepository
{
    public async Task<IEnumerable<Dependencia>> GetActiveAsync() =>
        await db.Dependencias.Include(d => d.Region).Where(d => d.IsActive).OrderBy(d => d.Clave).ToListAsync();
}
