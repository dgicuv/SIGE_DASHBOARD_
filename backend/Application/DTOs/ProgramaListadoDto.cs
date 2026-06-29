namespace SIGE.Dashboard;

public record ProgramaListadoDto(
    string GroupBy,
    int Year,
    int Total,
    int Matricula,
    string AreaAcademica,
    string Dependencia,
    string Region
);
