using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace SIGE.Dashboard;

public class ProgramasEducativosRepository(AppDbContext db, IOptions<SigeConfiguration> config) : IProgramasEducativosRepository
{
    private readonly int _anio = config.Value.Anio;

    public async Task<IEnumerable<ProgramaEducativo>> GetActiveAsync() =>
        await db.ProgramasEducativos
            .Include(p => p.Nivel)
            .Include(p => p.Modalidad)
            .Include(p => p.Dependencia).ThenInclude(d => d!.Region)
            .Include(p => p.AreaConocimiento)
            .Include(p => p.AreaAcademica)
            .Where(p => p.IsActive && p.Anio >= _anio - 4 && p.Anio <= _anio)
            .OrderBy(p => p.Name)
            .ToListAsync();
}
