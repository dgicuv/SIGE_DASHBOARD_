using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SIGE.Dashboard;

[ApiController]
[Authorize(Roles = "matricula-formal")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class MatriculaFormalController(
    GetEstadisticaMatriculaHandler estadisticaHandler,
    GetDiscapacidadPorAreaAcademicaHandler discapacidadHandler,
    GetHablantesLenguaIndigenaHandler hablantesLenguaIndigenaHandler,
    GetMatriculaPorProgramaEducativoHandler matriculaPorProgramaEducativoHandler) : ControllerBase
{
    [HttpGet("graficas/estadistica")]
    public async Task<IActionResult> GetEstadistica([FromQuery] int? idRegion, [FromQuery] int? idDependencia) =>
        Ok(await estadisticaHandler.HandleAsync(idRegion, idDependencia));
 
    [HttpGet("graficas/discapacidad-por-area-academica")]
    public async Task<IActionResult> GetDiscapacidadPorAreaAcademica(
        [FromQuery] int? idRegion,
        [FromQuery] int? idDependencia)
    {
        var data = await discapacidadHandler.HandleAsync(idRegion, idDependencia);
        return Ok(new
        {
            title = "Discapacidad por área académica",
            description = "Distribución de matrícula con discapacidad por área académica",
            info = "Fecha de corte escolar 2025 - 2026. Fuente de Información: Estadística 911",
            filter = new[] { "years", "sex" },
            columns = Array.Empty<object>(),
            categoryLabel = "Área Académica",
            data

        });
    }


    [HttpGet("graficas/hablantes-lengua-indigena")]
    public async Task<IActionResult> GetHablantesLenguaIndigena(
        [FromQuery] int? idRegion,
        [FromQuery] int? idDependencia)
    {
        var data = await hablantesLenguaIndigenaHandler.HandleAsync(idRegion, idDependencia);
        return Ok(new
        {
            title = "Hablantes de lengua indígena",
            description = "Distribución de matrícula hablante de lengua indígena por área académica",
            info = "Fecha de corte escolar 2025 - 2026. Fuente de Información: Estadística 911",
            filter = new[] { "years", "sex" },
            columns = Array.Empty<object>(),
            categoryLabel = idRegion.HasValue ? "Dependencia" : "Región",
            data
        });
    }

    [HttpGet("graficas/matricula-por-programa-educativo")]
    public async Task<IActionResult> GetMatriculaPorProgramaEducativo(
        [FromQuery] int? idRegion,
        [FromQuery] int? idDependencia)
    {
        var data = await matriculaPorProgramaEducativoHandler.HandleAsync(idRegion, idDependencia);
        return Ok(new
        {
            title = "Matrícula por programa educativo",
            description = "Distribución de matrícula por programa educativo",
            info = "Fecha de corte escolar 2025 - 2026. Fuente de Información: Estadística 911",
            filter = new[] { "years", "sex", "nivelEducativo", "modalidad" },
            columns = new[]
            {
                new { key = "nivelEducativo", header = "Nivel Educativo" },
                new { key = "modalidad", header = "Modalidad" },
            },
            categoryLabel = "Programa Educativo",
            data
        });
    }
}
