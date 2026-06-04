using Asp.Versioning.ApiExplorer;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

public class ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
{
    private readonly IApiVersionDescriptionProvider _provider;

    public ConfigureSwaggerOptions(IApiVersionDescriptionProvider provider)
        => _provider = provider;

    public void Configure(SwaggerGenOptions options)
    {
        foreach (var description in _provider.ApiVersionDescriptions)
        {
            options.SwaggerDoc(description.GroupName, new OpenApiInfo
            {
                Title = "UV SIGE Dashboard API",
                Version = description.ApiVersion.ToString(),
                Description = description.IsDeprecated ? "Esta versión de la API está obsoleta." : null
            });
        }

        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            Description = "Ingresa el token JWT obtenido en /auth/login"
        });

        options.AddSecurityRequirement(doc => new OpenApiSecurityRequirement
        {
            { new OpenApiSecuritySchemeReference("Bearer", doc), [] }
        });
    }
}
