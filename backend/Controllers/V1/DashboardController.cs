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

        var data = new
        {
            title = "Entidades - Dependencias",
            description = "Número de entidades por región",
            categories = new[] { "Coatzacoalcos / Minatitlán", "Orizaba / Córdoba", "Poza Rica / Túxpan", "Veracruz", "Xalapa" },
            values = new[] { 29, 27, 29, 41, 218 },
            type = "bar",
            dataType = "number",
            xAxis = new { name = "Región", type = "category" },
            yAxis = new { name = "Total", type = "value" }
        };

        return Ok(data);
    }

    [HttpGet("Personal")]
    public async Task<IActionResult> GetPersonal()
    {

        var data = new
        {
            title = "Personal",
            description = "Fecha de corte 2025. Fuente de Información",
            categories = new[] { "Académico", "Administrativo / Técnico", "Confianza", "Eventual", "Mandos medios y Superiores" },
            values = new[] { 5950, 2558, 1763, 1108, 594 },
            type = "bar",
            dataType = "number",
            xAxis = new { name = "Categoría", type = "category" },
            yAxis = new { name = "Total", type = "value" }
        };

        return Ok(data);
    }


}
