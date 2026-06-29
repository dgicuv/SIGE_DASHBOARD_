using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace SIGE.Dashboard;

public class ProgramasEducativosRepository(AppDbContext db, IOptions<SigeConfiguration> config) : IProgramasEducativosRepository
{
    private readonly int _anio = config.Value.Anio;

    public async Task<IEnumerable<ProgramaEducativo>> GetActiveAsync() =>
        await GetActiveAsync(null, null);

    public async Task<IEnumerable<ProgramaEducativo>> GetActiveAsync(int? idRegion, int? idDependencia) =>
        await db.ProgramasEducativos
            .Include(p => p.Nivel)
            .Include(p => p.Modalidad)
            .Include(p => p.Dependencia).ThenInclude(d => d!.Region)
            .Include(p => p.AreaConocimiento)
            .Include(p => p.AreaAcademica)
            .Where(p => p.IsActive && p.Anio >= _anio - 4 && p.Anio <= _anio)
            .Where(p => idDependencia == null || p.FkIdDependencia == idDependencia)
            .Where(p => idRegion == null || p.Dependencia!.FkIdRegion == idRegion)
            .OrderBy(p => p.Name)
            .ToListAsync();

    public async Task<IEnumerable<ProgramaEducativo>> GetActiveWithStudentsAsync(int? idRegion, int? idDependencia) =>
        await db.ProgramasEducativos
            .Include(p => p.Nivel)
            .Include(p => p.Modalidad)
            .Include(p => p.Dependencia).ThenInclude(d => d!.Region)
            .Include(p => p.AreaConocimiento)
            .Include(p => p.AreaAcademica)
            .Where(p => p.IsActive && p.Anio >= _anio - 4 && p.Anio <= _anio)
            .Where(p => idDependencia == null || p.FkIdDependencia == idDependencia)
            .Where(p => idRegion == null || p.Dependencia!.FkIdRegion == idRegion)
            .Where(p => db.Matriculas.Any(m => m.IdProgramaEducativo == p.Id && m.MatriculaHombres + m.MatriculaMujeres > 0))
            .OrderBy(p => p.Name)
            .ToListAsync();

    public async Task<IEnumerable<DistribucionProgramasDto>> GetDistribucionPorAreaAcademicaAsync(int? idRegion, int? idDependencia)
    {
        var programas = await GetActiveWithStudentsAsync(idRegion, idDependencia);
        return programas
            .GroupBy(p => new { Category = p.AreaAcademica?.Name ?? "", p.Anio })
            .Select(g => new DistribucionProgramasDto(g.Key.Category, g.Key.Anio, g.Count()))
            .OrderBy(d => d.GroupBy).ThenBy(d => d.Year);
    }

    public async Task<IEnumerable<DistribucionProgramasDto>> GetDistribucionPorRegionAsync(int? idRegion, int? idDependencia)
    {
        var programas = await GetActiveWithStudentsAsync(idRegion, idDependencia);
        return programas
            .GroupBy(p => new { Category = p.Dependencia?.Region?.Name ?? "", p.Anio })
            .Select(g => new DistribucionProgramasDto(g.Key.Category, g.Key.Anio, g.Count()))
            .OrderBy(d => d.GroupBy).ThenBy(d => d.Year);
    }

    public async Task<IEnumerable<DistribucionProgramasDto>> GetDistribucionPorModalidadAsync(int? idRegion, int? idDependencia)
    {
        var programas = await GetActiveWithStudentsAsync(idRegion, idDependencia);
        return programas
            .GroupBy(p => new { Category = p.Modalidad?.Name ?? "", p.Anio })
            .Select(g => new DistribucionProgramasDto(g.Key.Category, g.Key.Anio, g.Count()))
            .OrderBy(d => d.GroupBy).ThenBy(d => d.Year);
    }

    public async Task<IEnumerable<DistribucionProgramasDto>> GetDistribucionPorNivelAsync(int? idRegion, int? idDependencia)
    {
        var programas = await GetActiveWithStudentsAsync(idRegion, idDependencia);
        return programas
            .GroupBy(p => new { Category = p.Nivel?.Name ?? "", p.Anio })
            .Select(g => new DistribucionProgramasDto(g.Key.Category, g.Key.Anio, g.Count()))
            .OrderBy(d => d.GroupBy).ThenBy(d => d.Year);
    }
}
