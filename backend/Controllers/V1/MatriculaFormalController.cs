using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SIGE.Dashboard;

[ApiController]
[Authorize(Roles = "matricula-formal")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class MatriculaFormalController(GetEstadisticaMatriculaHandler estadisticaHandler) : ControllerBase
{
    [HttpGet("graficas/estadistica")]
    public async Task<IActionResult> GetEstadistica([FromQuery] int? idRegion, [FromQuery] int? idDependencia) =>
        Ok(await estadisticaHandler.HandleAsync(idRegion, idDependencia));
}
