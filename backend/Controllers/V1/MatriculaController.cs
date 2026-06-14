using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SIGE.Dashboard;

[ApiController]
[Authorize(Roles = "matricula")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class MatriculaController(GetAllMatriculaHandler handler) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await handler.HandleAsync());
}
