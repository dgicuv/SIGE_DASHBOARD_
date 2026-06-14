namespace SIGE.Dashboard;

public class Dependencia
{
    public int Id { get; set; }
    public string Clave { get; set; } = null!;
    public string Name { get; set; } = null!;
    public int FkIdRegion { get; set; }
    public Region? Region { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsActive { get; set; }
}
