using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SIGE.Dashboard;

[ApiController]
[Authorize(Roles = "programas-educativos")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class ProgramasEducativosController(
    GetActiveProgramasEducativosHandler handler,
    GetEstadisticaProgramasEducativosHandler estadisticaHandler,
    GetListadoProgramasHandler listadoHandler,
    GetDistribucionPorAreaAcademicaHandler distribucionAreaAcademicaHandler,
    GetDistribucionPorRegionHandler distribucionRegionHandler,
    GetDistribucionPorModalidadHandler distribucionModalidadHandler,
    GetDistribucionPorNivelHandler distribucionNivelHandler) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await handler.HandleAsync());

    [HttpGet("graficas/listado")]
    public async Task<IActionResult> GetListado([FromQuery] int? idRegion, [FromQuery] int? idDependencia)
    {
        var data = await listadoHandler.HandleAsync(idRegion, idDependencia);
        return Ok(new
        {
            title = "Listado de programas educativos",
            description = "Programas educativos activos por región y dependencia",
            info = "Fecha de corte escolar 2025 - 2026. Fuente de Información: Estadística 911",
            filter = new[] { "years" },
            columns = new[]
            {
                new { key = "matricula",     header = "Matrícula" },
                new { key = "areaAcademica", header = "Área Académica" },
                new { key = "dependencia",   header = "Dependencia" },
                new { key = "region",        header = "Región" },
            },
            categoryLabel = "Programa Educativo",
            data
        });
    }

    [HttpGet("graficas/estadistica")]
    public async Task<IActionResult> GetEstadistica([FromQuery] int? idRegion, [FromQuery] int? idDependencia) =>
        Ok(await estadisticaHandler.HandleAsync(idRegion, idDependencia));

    [HttpGet("graficas/distribucion-por-area-academica")]
    public async Task<IActionResult> GetDistribucionPorAreaAcademica([FromQuery] int? idRegion, [FromQuery] int? idDependencia)
    {
        var data = await distribucionAreaAcademicaHandler.HandleAsync(idRegion, idDependencia);
        return Ok(new
        {
            title = "Programas educativos por área académica",
            description = "Distribución de programas educativos por área académica",
            info = "Fecha de corte escolar 2025 - 2026. Fuente de Información: Estadística 911",
            filter = new[] { "years" },
            columns = Array.Empty<object>(),
            categoryLabel = "Área Académica",
            data
        });
    }

    [HttpGet("graficas/distribucion-por-region")]
    public async Task<IActionResult> GetDistribucionPorRegion([FromQuery] int? idRegion, [FromQuery] int? idDependencia)
    {
        var data = await distribucionRegionHandler.HandleAsync(idRegion, idDependencia);
        return Ok(new
        {
            title = "Programas educativos por región",
            description = "Distribución de programas educativos por región",
            info = "Fecha de corte escolar 2025 - 2026. Fuente de Información: Estadística 911",
            filter = new[] { "years" },
            columns = Array.Empty<object>(),
            categoryLabel = "Región",
            data
        });
    }

    [HttpGet("graficas/distribucion-por-modalidad")]
    public async Task<IActionResult> GetDistribucionPorModalidad([FromQuery] int? idRegion, [FromQuery] int? idDependencia)
    {
        var data = await distribucionModalidadHandler.HandleAsync(idRegion, idDependencia);
        return Ok(new
        {
            title = "Programas educativos por modalidad",
            description = "Distribución de programas educativos por modalidad",
            info = "Fecha de corte escolar 2025 - 2026. Fuente de Información: Estadística 911",
            filter = new[] { "years" },
            columns = Array.Empty<object>(),
            categoryLabel = "Modalidad",
            data
        });
    }

    [HttpGet("graficas/distribucion-por-nivel")]
    public async Task<IActionResult> GetDistribucionPorNivel([FromQuery] int? idRegion, [FromQuery] int? idDependencia)
    {
        var data = await distribucionNivelHandler.HandleAsync(idRegion, idDependencia);
        return Ok(new
        {
            title = "Programas educativos por nivel educativo",
            description = "Distribución de programas educativos por nivel educativo",
            info = "Fecha de corte escolar 2025 - 2026. Fuente de Información: Estadística 911",
            filter = new[] { "years" },
            columns = Array.Empty<object>(),
            categoryLabel = "Nivel Educativo",
            data
        });
    }
}
