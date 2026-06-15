using Microsoft.EntityFrameworkCore;

namespace SIGE.Dashboard;

public class RegionesRepository(AppDbContext db) : IRegionesRepository
{
    public async Task<IEnumerable<Region>> GetActiveAsync() =>
        await db.Regiones.Where(r => r.IsActive).ToListAsync();
}
