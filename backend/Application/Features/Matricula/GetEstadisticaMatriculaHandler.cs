namespace SIGE.Dashboard;

public class GetEstadisticaMatriculaHandler(IMatriculaRepository repository)
{
    public async Task<EstadisticaMatriculaDto> HandleAsync(int? idRegion = null, int? idDependencia = null)
    {
        var matriculas = await repository.GetAllAsync(idRegion, idDependencia);

        return new EstadisticaMatriculaDto(
            TotalMatricula: matriculas.Sum(m => m.MatriculaHombres + m.MatriculaMujeres),
            TotalDiscapacidad: matriculas.Sum(m => m.DiscapacidadHombres + m.DiscapacidadMujeres),
            TotalLenguaIndigena: matriculas.Sum(m => m.LenguaIndigenaHombres + m.LenguaIndigenaMujeres),
            TotalMujeres: matriculas.Sum(m => m.MatriculaMujeres),
            TotalHombres: matriculas.Sum(m => m.MatriculaHombres),
            TotalNoBinario: matriculas.Sum(m => m.NoBinarioHombres + m.NoBinarioMujeres)
        );
    }
}
