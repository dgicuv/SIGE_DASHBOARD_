using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SIGE.Dashboard;

[ApiController]
[Authorize(Roles = "matricula-formal-admin")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class MatriculaFormalAdminController : ControllerBase
{
    private const long MaxFileSizeBytes = 4 * 1024 * 1024;

    private static readonly string[] AllowedContentTypes =
    [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    private static readonly string[] AllowedExtensions = [".xls", ".xlsx"];

    [HttpPost("upload")]
    public IActionResult Upload(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest();

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!AllowedExtensions.Contains(extension) || !AllowedContentTypes.Contains(file.ContentType))
            return UnprocessableEntity();

        if (file.Length > MaxFileSizeBytes)
            return StatusCode(StatusCodes.Status413RequestEntityTooLarge);

        return Ok();
    }
}
