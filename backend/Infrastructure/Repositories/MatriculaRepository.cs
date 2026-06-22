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
            .OrderBy(dto => dto.GroupBy)
            .ThenBy(dto => dto.Year)
            .ThenBy(dto => dto.Sex);
    }

    public async Task<IEnumerable<HablantesLenguaIndigenaDto>> GetHablantesLenguaIndigenaAsync(int? idRegion, int? idDependencia)
    {
        var query = db.Matriculas
            .Include(m => m.ProgramaEducativo)
                .ThenInclude(p => p!.Dependencia)
                    .ThenInclude(d => d!.Region)
            .AsQueryable();

        if (idRegion.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.Dependencia!.FkIdRegion == idRegion.Value);

        if (idDependencia.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.FkIdDependencia == idDependencia.Value);

        var rows = await query.ToListAsync();
        var agruparPorDependencia = idRegion.HasValue;

        return rows
            .GroupBy(m => new
            {
                GrupoNombre = agruparPorDependencia
                    ? $"{m.ProgramaEducativo!.Dependencia!.Clave} - {m.ProgramaEducativo!.Dependencia!.Name}"
                    : m.ProgramaEducativo!.Dependencia!.Region!.Name,
                m.Anio
            })
            .SelectMany(g =>
            {
                var hombres = g.Sum(m => m.LenguaIndigenaHombres);
                var mujeres = g.Sum(m => m.LenguaIndigenaMujeres);
                return new[]
                {
                    new HablantesLenguaIndigenaDto(g.Key.GrupoNombre, g.Key.Anio, "Hombre", hombres),
                    new HablantesLenguaIndigenaDto(g.Key.GrupoNombre, g.Key.Anio, "Mujer", mujeres),
                    new HablantesLenguaIndigenaDto(g.Key.GrupoNombre, g.Key.Anio, "Todos", hombres + mujeres),
                };
            })
            .OrderBy(dto => dto.GroupBy)
            .ThenBy(dto => dto.Year)
            .ThenBy(dto => dto.Sex);
    }

    public async Task<IEnumerable<MatriculaPorProgramaEducativoDto>> GetMatriculaPorProgramaEducativoAsync(int? idRegion, int? idDependencia)
    {
        var query = db.Matriculas
            .Include(m => m.ProgramaEducativo)
                .ThenInclude(p => p!.Dependencia)
            .Include(m => m.ProgramaEducativo)
                .ThenInclude(p => p!.Nivel)
            .Include(m => m.ProgramaEducativo)
                .ThenInclude(p => p!.Modalidad)
            .AsQueryable();

        if (idRegion.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.Dependencia!.FkIdRegion == idRegion.Value);

        if (idDependencia.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.FkIdDependencia == idDependencia.Value);

        var rows = await query.ToListAsync();

        return rows
            .GroupBy(m => new
            {
                ProgramaNombre = m.ProgramaEducativo!.Name,
                NivelNombre = m.ProgramaEducativo!.Nivel!.Name,
                ModalidadNombre = m.ProgramaEducativo!.Modalidad!.Name,
                m.Anio
            })
            .SelectMany(g =>
            {
                var hombres = g.Sum(m => m.MatriculaHombres);
                var mujeres = g.Sum(m => m.MatriculaMujeres);
                return new[]
                {
                    new MatriculaPorProgramaEducativoDto(g.Key.ProgramaNombre, g.Key.Anio, "Hombre", hombres, g.Key.NivelNombre, g.Key.ModalidadNombre),
                    new MatriculaPorProgramaEducativoDto(g.Key.ProgramaNombre, g.Key.Anio, "Mujer", mujeres, g.Key.NivelNombre, g.Key.ModalidadNombre),
                    new MatriculaPorProgramaEducativoDto(g.Key.ProgramaNombre, g.Key.Anio, "Todos", hombres + mujeres, g.Key.NivelNombre, g.Key.ModalidadNombre),
                };
            })
            .OrderBy(dto => dto.GroupBy)
            .ThenBy(dto => dto.Year)
            .ThenBy(dto => dto.Sex);
    }
}
