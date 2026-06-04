using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SIGE.Dashboard;

[ApiController]
[Authorize(Roles = "general")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class GeneralController : ControllerBase
{
}
