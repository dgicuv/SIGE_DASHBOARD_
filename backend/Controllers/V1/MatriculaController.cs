using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SIGE.Dashboard;

[ApiController]
[Authorize(Roles = "matricula-formal")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class MatriculaController(GetDiscapacidadPorAreaAcademicaHandler discapacidadHandler) : ControllerBase
{
    [HttpGet("graficas/discapacidad-por-area-academica")]
    public async Task<IActionResult> GetDiscapacidadPorAreaAcademica(
        [FromQuery] int? idRegion,
        [FromQuery] int? idDependencia)
    {
        var data = await discapacidadHandler.HandleAsync(idRegion, idDependencia);
        return Ok(data);
    }
}
