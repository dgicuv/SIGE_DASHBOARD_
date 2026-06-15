namespace SIGE.Dashboard;

public record ProgramaEducativoDto(
    int Id,
    string Name,
    string Clave,
    string ClaveEscuela,
    int NivelId,
    string NivelName,
    int ModalidadId,
    string ModalidadName,
    int DependenciaId,
    string DependenciaClave,
    string DependenciaName,
    int RegionId,
    string RegionName,
    int AreaConocimientoId,
    string AreaConocimientoName,
    int AreaAcademicaId,
    string AreaAcademicaName
);
