namespace SIGE.Dashboard;

public record MatriculaPorProgramaEducativoDto(
    string GroupBy,
    int Year,
    string Sex,
    int Total,
    string NivelEducativo,
    string Modalidad
);
