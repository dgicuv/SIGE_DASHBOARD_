using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace SIGE.Dashboard;

public class DependenciasRepository(AppDbContext db, IOptions<SigeConfiguration> config) : IDependenciasRepository
{
    private readonly int _anio = config.Value.Anio;

    public async Task<IEnumerable<Dependencia>> GetActiveAsync() =>
        await db.Dependencias
            .Include(d => d.Region)
            .Where(d => d.IsActive && d.Anio >= _anio - 4 && d.Anio <= _anio)
            .OrderBy(d => d.Clave)
            .ToListAsync();
}
