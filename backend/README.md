# SIGE Dashboard — Backend

ASP.NET Core minimal API (.NET 10) que sirve como backend del dashboard SIGE.

## Requisitos

- .NET 10 SDK
- SQL Server accesible según el ambiente

## Configuración de ambientes

Los archivos `appsettings.{Environment}.json` **no se guardan en git**. Copia `appsettings.example.json` y llénalo con los datos reales:

```bash
cp appsettings.example.json appsettings.Development.json
cp appsettings.example.json appsettings.Training.json
cp appsettings.example.json appsettings.Production.json
```

Cada archivo debe contener la cadena de conexión y la configuración JWT del ambiente correspondiente.

## Ejecutar

### Con perfil de launch (recomendado)

```bash
dotnet run                            # Development (perfil por defecto)
dotnet run --launch-profile training
dotnet run --launch-profile production
```

### Especificando la variable de entorno directamente

```bash
# bash / fish
ASPNETCORE_ENVIRONMENT=Training dotnet run

# PowerShell
$env:ASPNETCORE_ENVIRONMENT="Training"; dotnet run

# CMD
set ASPNETCORE_ENVIRONMENT=Training && dotnet run
```

## Otros comandos

```bash
dotnet build   # compilar
dotnet watch   # hot reload (usa el perfil http → Development)
```

La API corre en `http://localhost:5032`. El spec OpenAPI está disponible en `/openapi/v1.json` cuando el ambiente es `Development`.
