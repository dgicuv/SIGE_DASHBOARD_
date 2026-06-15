using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SIGE.Dashboard;

[ApiController]
[Authorize(Roles = "programas-educativos")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class ProgramasEducativosController(GetActiveProgramasEducativosHandler handler) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await handler.HandleAsync());
}
