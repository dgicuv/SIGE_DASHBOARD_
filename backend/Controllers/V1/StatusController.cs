using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.V1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class StatusController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ok", version = "v1" });
}
