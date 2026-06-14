namespace SIGE.Dashboard;

public class FakeRegionesRepository : IRegionesRepository
{
    private static readonly List<Region> _data =
    [
        new() { Id = 1, Name = "Xalapa", IsActive = true },
        new() { Id = 2, Name = "Veracruz", IsActive = true },
        new() { Id = 3, Name = "Orizaba-Córdoba", IsActive = true },
        new() { Id = 4, Name = "Poza Rica-Tuxpan", IsActive = true },
        new() { Id = 5, Name = "Coatzacoalcos", IsActive = true },
    ];

    public Task<IEnumerable<Region>> GetActiveAsync() =>
        Task.FromResult(_data.Where(r => r.IsActive));
}
