using Microsoft.EntityFrameworkCore;

namespace SIGE.Dashboard;

public class ProgramasEducativosRepository(AppDbContext db) : IProgramasEducativosRepository
{
    public async Task<IEnumerable<ProgramaEducativo>> GetActiveAsync() =>
        await db.ProgramasEducativos
            .Include(p => p.Nivel)
            .Include(p => p.Modalidad)
            .Include(p => p.Dependencia).ThenInclude(d => d!.Region)
            .Include(p => p.AreaConocimiento)
            .Include(p => p.AreaAcademica)
            .Where(p => p.IsActive)
            .OrderBy(p => p.Name)
            .ToListAsync();
}
