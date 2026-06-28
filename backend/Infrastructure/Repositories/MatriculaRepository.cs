using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace SIGE.Dashboard;

public class MatriculaRepository(AppDbContext db, IOptions<SigeConfiguration> config) : IMatriculaRepository
{
    private readonly int _anio = config.Value.Anio;

    public async Task<IEnumerable<Matricula>> GetAllAsync() =>
        await db.Matriculas
            .Include(m => m.ProgramaEducativo)
            .Where(m => m.Anio == _anio)
            .OrderBy(m => m.ProgramaEducativo!.Name)
            .ToListAsync();

    public async Task<IEnumerable<Matricula>> GetAllAsync(int? idRegion, int? idDependencia)
    {
        var query = db.Matriculas
            .Include(m => m.ProgramaEducativo)
                .ThenInclude(p => p!.Dependencia)
            .Where(m => m.Anio == _anio)
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
            .Where(m => m.Anio >= _anio - 4 && m.Anio <= _anio)
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

    public Task<IEnumerable<HablantesLenguaIndigenaDto>> GetHablantesLenguaIndigenaAsync(int? idRegion, int? idDependencia) =>
        idRegion.HasValue
            ? GetHablantesLenguaIndigenaPorDependenciaAsync(idRegion.Value, idDependencia)
            : GetHablantesLenguaIndigenaPorRegionAsync(idDependencia);

    private async Task<IEnumerable<HablantesLenguaIndigenaDto>> GetHablantesLenguaIndigenaPorDependenciaAsync(int idRegion, int? idDependencia)
    {
        var query = db.Matriculas
            .Where(m => m.ProgramaEducativo!.Dependencia!.FkIdRegion == idRegion && m.Anio >= _anio - 4 && m.Anio <= _anio)
            .AsQueryable();

        if (idDependencia.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.FkIdDependencia == idDependencia.Value);

        var grupos = await query
            .GroupBy(m => new
            {
                m.ProgramaEducativo!.Dependencia!.Clave,
                m.ProgramaEducativo!.Dependencia!.Name,
                m.Anio
            })
            .Select(g => new
            {
                g.Key.Clave,
                g.Key.Name,
                g.Key.Anio,
                Hombres = g.Sum(m => m.LenguaIndigenaHombres),
                Mujeres = g.Sum(m => m.LenguaIndigenaMujeres)
            })
            .ToListAsync();

        return grupos
            .SelectMany(g =>
            {
                var grupoNombre = $"{g.Clave} - {g.Name}";
                return new[]
                {
                    new HablantesLenguaIndigenaDto(grupoNombre, g.Anio, "Hombre", g.Hombres),
                    new HablantesLenguaIndigenaDto(grupoNombre, g.Anio, "Mujer", g.Mujeres),
                    new HablantesLenguaIndigenaDto(grupoNombre, g.Anio, "Todos", g.Hombres + g.Mujeres),
                };
            })
            .OrderBy(dto => dto.GroupBy)
            .ThenBy(dto => dto.Year)
            .ThenBy(dto => dto.Sex);
    }

    private async Task<IEnumerable<HablantesLenguaIndigenaDto>> GetHablantesLenguaIndigenaPorRegionAsync(int? idDependencia)
    {
        var query = db.Matriculas.Where(m => m.Anio >= _anio - 4 && m.Anio <= _anio).AsQueryable();

        if (idDependencia.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.FkIdDependencia == idDependencia.Value);

        var grupos = await query
            .GroupBy(m => new
            {
                m.ProgramaEducativo!.Dependencia!.Region!.Name,
                m.Anio
            })
            .Select(g => new
            {
                g.Key.Name,
                g.Key.Anio,
                Hombres = g.Sum(m => m.LenguaIndigenaHombres),
                Mujeres = g.Sum(m => m.LenguaIndigenaMujeres)
            })
            .ToListAsync();

        return grupos
            .SelectMany(g => new[]
            {
                new HablantesLenguaIndigenaDto(g.Name, g.Anio, "Hombre", g.Hombres),
                new HablantesLenguaIndigenaDto(g.Name, g.Anio, "Mujer", g.Mujeres),
                new HablantesLenguaIndigenaDto(g.Name, g.Anio, "Todos", g.Hombres + g.Mujeres),
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
            .Where(m => m.Anio >= _anio - 4 && m.Anio <= _anio)
            .AsQueryable();

        if (idRegion.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.Dependencia!.FkIdRegion == idRegion.Value);

        if (idDependencia.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.FkIdDependencia == idDependencia.Value);

        var rows = await query.ToListAsync();

        return rows
            .GroupBy(m => new
            {
                ProgramaNombre = $"{m.ProgramaEducativo!.Clave} - {m.ProgramaEducativo!.Name}",
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

    public async Task<IEnumerable<MovilidadPorNivelEducativoDto>> GetMovilidadPorNivelEducativoAsync(int? idRegion, int? idDependencia)
    {
        var query = db.Matriculas
            .Where(m => m.ProgramaEducativo!.IsActive && m.Anio >= _anio - 4 && m.Anio <= _anio)
            .AsQueryable();

        if (idRegion.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.Dependencia!.FkIdRegion == idRegion.Value);

        if (idDependencia.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.FkIdDependencia == idDependencia.Value);

        var grupos = await query
            .GroupBy(m => new
            {
                m.ProgramaEducativo!.Nivel!.Name,
                m.Anio
            })
            .Select(g => new
            {
                g.Key.Name,
                g.Key.Anio,
                HaciaAdentroHombres = g.Sum(m => m.MovilidadHaciaAdentroHombres),
                HaciaAdentroMujeres = g.Sum(m => m.MovilidadHaciaAdentroMujeres),
                HaciaAfueraHombres = g.Sum(m => m.MovilidadHaciaAfueraHombres),
                HaciaAfueraMujeres = g.Sum(m => m.MovilidadHaciaAfueraMujeres)
            })
            .ToListAsync();

        return grupos
            .SelectMany(g => new[]
            {
                new MovilidadPorNivelEducativoDto(g.Name, g.Anio, "Movilidad hacia adentro", "Hombre", g.HaciaAdentroHombres, g.Name),
                new MovilidadPorNivelEducativoDto(g.Name, g.Anio, "Movilidad hacia adentro", "Mujer", g.HaciaAdentroMujeres, g.Name),
                new MovilidadPorNivelEducativoDto(g.Name, g.Anio, "Movilidad hacia adentro", "Todos", g.HaciaAdentroHombres + g.HaciaAdentroMujeres, g.Name),
                new MovilidadPorNivelEducativoDto(g.Name, g.Anio, "Movilidad hacia afuera", "Hombre", g.HaciaAfueraHombres, g.Name),
                new MovilidadPorNivelEducativoDto(g.Name, g.Anio, "Movilidad hacia afuera", "Mujer", g.HaciaAfueraMujeres, g.Name),
                new MovilidadPorNivelEducativoDto(g.Name, g.Anio, "Movilidad hacia afuera", "Todos", g.HaciaAfueraHombres + g.HaciaAfueraMujeres, g.Name),
            })
            .OrderBy(dto => dto.GroupBy)
            .ThenBy(dto => dto.Year)
            .ThenBy(dto => dto.Tipo)
            .ThenBy(dto => dto.Sex);
    }

    public async Task<IEnumerable<TrayectoriaAcademicaPorNivelEducativoDto>> GetTrayectoriaAcademicaPorNivelEducativoAsync(int? idRegion, int? idDependencia)
    {
        var query = db.Matriculas
            .Where(m => m.ProgramaEducativo!.IsActive && m.Anio >= _anio - 4 && m.Anio <= _anio)
            .AsQueryable();

        if (idRegion.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.Dependencia!.FkIdRegion == idRegion.Value);

        if (idDependencia.HasValue)
            query = query.Where(m => m.ProgramaEducativo!.FkIdDependencia == idDependencia.Value);

        var rows = await query
            .GroupBy(m => new
            {
                NivelId = m.ProgramaEducativo!.FkIdNivel,
                m.ProgramaEducativo!.Nivel!.Name,
                m.Anio
            })
            .Select(g => new
            {
                g.Key.NivelId,
                g.Key.Name,
                g.Key.Anio,
                IngresoHombres = g.Sum(m => m.PrimerIngresoHombres),
                IngresoMujeres = g.Sum(m => m.PrimerIngresoMujeres),
                EgresoHombres = g.Sum(m => m.EgresadosHombres),
                EgresoMujeres = g.Sum(m => m.EgresadosMujeres),
                TituladosHombres = g.Sum(m => m.TituladosHombres),
                TituladosMujeres = g.Sum(m => m.TituladosMujeres),
                PermanenciaHombres = g.Sum(m => m.MatriculaHombres),
                PermanenciaMujeres = g.Sum(m => m.MatriculaMujeres),
            })
            .ToListAsync();

        static int CanonicalId(int id) => id switch { 0 or 1 => 1, 2 or 25 or 28 => 2, _ => id };

        return rows
            .GroupBy(g => new { CanonicalId = CanonicalId(g.NivelId), g.Anio })
            .SelectMany(cg =>
            {
                var name = cg.FirstOrDefault(g => g.NivelId == cg.Key.CanonicalId)?.Name ?? cg.First().Name;
                var anio = cg.Key.Anio;
                var ingresoH = cg.Sum(g => g.IngresoHombres);
                var ingresoM = cg.Sum(g => g.IngresoMujeres);
                var egresoH = cg.Sum(g => g.EgresoHombres);
                var egresoM = cg.Sum(g => g.EgresoMujeres);
                var tituladosH = cg.Sum(g => g.TituladosHombres);
                var tituladosM = cg.Sum(g => g.TituladosMujeres);
                var permanenciaH = cg.Sum(g => g.PermanenciaHombres);
                var permanenciaM = cg.Sum(g => g.PermanenciaMujeres);
                return new[]
                {
                    new TrayectoriaAcademicaPorNivelEducativoDto(name, anio, "Ingreso", "Hombre", ingresoH, name),
                    new TrayectoriaAcademicaPorNivelEducativoDto(name, anio, "Ingreso", "Mujer", ingresoM, name),
                    new TrayectoriaAcademicaPorNivelEducativoDto(name, anio, "Ingreso", "Todos", ingresoH + ingresoM, name),
                    new TrayectoriaAcademicaPorNivelEducativoDto(name, anio, "Egreso", "Hombre", egresoH, name),
                    new TrayectoriaAcademicaPorNivelEducativoDto(name, anio, "Egreso", "Mujer", egresoM, name),
                    new TrayectoriaAcademicaPorNivelEducativoDto(name, anio, "Egreso", "Todos", egresoH + egresoM, name),
                    new TrayectoriaAcademicaPorNivelEducativoDto(name, anio, "Titulados", "Hombre", tituladosH, name),
                    new TrayectoriaAcademicaPorNivelEducativoDto(name, anio, "Titulados", "Mujer", tituladosM, name),
                    new TrayectoriaAcademicaPorNivelEducativoDto(name, anio, "Titulados", "Todos", tituladosH + tituladosM, name),
                    new TrayectoriaAcademicaPorNivelEducativoDto(name, anio, "Permanencia", "Hombre", permanenciaH, name),
                    new TrayectoriaAcademicaPorNivelEducativoDto(name, anio, "Permanencia", "Mujer", permanenciaM, name),
                    new TrayectoriaAcademicaPorNivelEducativoDto(name, anio, "Permanencia", "Todos", permanenciaH + permanenciaM, name),
                };
            })
            .OrderBy(dto => dto.GroupBy)
            .ThenBy(dto => dto.Year)
            .ThenBy(dto => dto.Tipo)
            .ThenBy(dto => dto.Sex);
    }
}
