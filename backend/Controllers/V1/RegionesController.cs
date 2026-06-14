using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SIGE.Dashboard;

[ApiController]
[Authorize(Roles = "regiones")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class RegionesController(GetActiveRegionesHandler handler) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await handler.HandleAsync());
}
