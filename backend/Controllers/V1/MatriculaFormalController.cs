using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SIGE.Dashboard;

[ApiController]
[Authorize(Roles = "matricula-formal")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class MatriculaFormalController(GetEstadisticaMatriculaHandler estadisticaHandler, GetDiscapacidadPorAreaAcademicaHandler discapacidadHandler) : ControllerBase
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
            data
        });
    }

}
