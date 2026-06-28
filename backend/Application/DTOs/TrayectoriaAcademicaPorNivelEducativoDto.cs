namespace SIGE.Dashboard;

public record TrayectoriaAcademicaPorNivelEducativoDto(
    string GroupBy,
    int Year,
    string Tipo,
    string Sex,
    int Total,
    string NivelEducativo
);
