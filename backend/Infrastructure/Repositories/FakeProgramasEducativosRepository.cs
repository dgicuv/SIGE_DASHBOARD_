namespace SIGE.Dashboard;

public class FakeProgramasEducativosRepository : IProgramasEducativosRepository
{
    public Task<IEnumerable<ProgramaEducativo>> GetActiveAsync()
    {
        var dependenciasById = FakeCatalogData.Dependencias.ToDictionary(d => d.Id);

        var result = FakeCatalogData.ProgramasEducativos
            .Where(p => p.IsActive)
            .OrderBy(p => p.Name)
            .Select(p =>
            {
                var dep = dependenciasById[p.FkIdDependencia];
                dep.Region = FakeCatalogData.Regiones[dep.FkIdRegion];

                p.Nivel             = FakeCatalogData.Niveles[p.FkIdNivel];
                p.Modalidad         = FakeCatalogData.Modalidades[p.FkIdModalidad];
                p.Dependencia       = dep;
                p.AreaConocimiento  = FakeCatalogData.AreasConocimiento[p.FkIdAreasConocimiento];
                p.AreaAcademica     = FakeCatalogData.AreasAcademicas[p.FkIdAreasAcademicas];
                return p;
            });

        return Task.FromResult<IEnumerable<ProgramaEducativo>>(result);
    }
}
