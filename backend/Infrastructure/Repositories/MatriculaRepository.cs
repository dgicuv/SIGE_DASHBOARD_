using Microsoft.EntityFrameworkCore;

namespace SIGE.Dashboard;

public class MatriculaRepository(AppDbContext db) : IMatriculaRepository
{
    public async Task<IEnumerable<Matricula>> GetAllAsync() =>
        await db.Matriculas
            .Include(m => m.ProgramaEducativo)
            .OrderBy(m => m.ProgramaEducativo!.Name)
            .ToListAsync();

    public async Task<IEnumerable<Matricula>> GetAllAsync(int? idRegion, int? idDependencia)
    {
        var query = db.Matriculas
            .Include(m => m.ProgramaEducativo)
                .ThenInclude(p => p!.Dependencia)
            .AsQueryable();

        if (idRegion.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.Dependencia!.FkIdRegion == idRegion.Value);

        if (idDependencia.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.FkIdDependencia == idDependencia.Value);

        return await query.ToListAsync();
    }

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
                AreaNombre = m.ProgramaEducativo!.AreaAcademica!.Name,
                m.Anio
            })
            .SelectMany(g =>
            {
                var hombres = g.Sum(m => m.DiscapacidadHombres);
                var mujeres = g.Sum(m => m.DiscapacidadMujeres);
                return new[]
                {
                    new DiscapacidadPorAreaAcademicaDto(g.Key.AreaNombre, g.Key.Anio, "Hombre", hombres),
                    new DiscapacidadPorAreaAcademicaDto(g.Key.AreaNombre, g.Key.Anio, "Mujer", mujeres),
                    new DiscapacidadPorAreaAcademicaDto(g.Key.AreaNombre, g.Key.Anio, "Todos", hombres + mujeres),
                };
            })
            .OrderBy(dto => dto.AreaAcademica)
            .ThenBy(dto => dto.Anio)
            .ThenBy(dto => dto.Sexo);
    }
}
