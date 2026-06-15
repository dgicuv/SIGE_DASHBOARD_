using Microsoft.EntityFrameworkCore;

namespace SIGE.Dashboard;

public class MatriculaRepository(AppDbContext db) : IMatriculaRepository
{
    public async Task<IEnumerable<Matricula>> GetAllAsync() =>
        await db.Matriculas
            .Include(m => m.ProgramaEducativo)
            .OrderBy(m => m.ProgramaEducativo!.Name)
            .ToListAsync();

    public async Task<IEnumerable<DiscapacidadPorAreaAcademicaDto>> GetDiscapacidadPorAreaAcademicaAsync(int? idRegion, int? idDependencia)
    {
        var query = db.Matriculas
            .Include(m => m.ProgramaEducativo)
                .ThenInclude(p => p!.Dependencia)
            .Include(m => m.ProgramaEducativo)
                .ThenInclude(p => p!.AreaAcademica)
            .AsQueryable();

        if (idRegion.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.Dependencia!.FkIdRegion == idRegion.Value);

        if (idDependencia.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.FkIdDependencia == idDependencia.Value);

        var rows = await query.ToListAsync();

        return rows
            .GroupBy(m => new
            {
                AreaId = m.ProgramaEducativo!.FkIdAreasAcademicas,
                AreaNombre = m.ProgramaEducativo.AreaAcademica!.Name
            })
            .Select(g =>
            {
                var hombres = g.Sum(m => m.DiscapacidadHombres);
                var mujeres = g.Sum(m => m.DiscapacidadMujeres);
                return new DiscapacidadPorAreaAcademicaDto(g.Key.AreaNombre, hombres, mujeres, hombres + mujeres);
            })
            .OrderBy(dto => dto.AreaAcademica);
    }
}
