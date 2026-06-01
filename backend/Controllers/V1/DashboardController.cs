using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace SIGE.Dashboard;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class DashboardController : ControllerBase
{
    [HttpGet("Entidades")]
    public async Task<IActionResult> GetEntidades()
    {
        await Task.CompletedTask;

        var data = new
        {
            description = "Número de entidades por región",
            categories  = new[] { "Coatzacoalcos/Minatitlán", "Orizaba/Córdoba", "Poza Rica/Túxpan", "Veracruz", "Xalapa" },
            values      = new[] { 29, 27, 29, 41, 218 },
            type        = "bar",
            dataType    = "number",
            xAxis       = new { name = "Región",  type = "category" },
            yAxis       = new { name = "Total",   type = "value" }
        };

        return Ok(data);
    }
}
