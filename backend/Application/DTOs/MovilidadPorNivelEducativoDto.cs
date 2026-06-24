namespace SIGE.Dashboard;

public record MovilidadPorNivelEducativoDto(
    string GroupBy,
    int Year,
    string Tipo,
    string Sex,
    int Total,
    string NivelEducativo
);
