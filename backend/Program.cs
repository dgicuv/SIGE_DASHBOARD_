using Asp.Versioning.ApiExplorer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIGE.Dashboard;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.Configure<SigeConfiguration>(
    builder.Configuration.GetSection("configuration"));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped<IRegionesRepository, RegionesRepository>();
builder.Services.AddScoped<IDependenciasRepository, DependenciasRepository>();
builder.Services.AddScoped<IProgramasEducativosRepository, ProgramasEducativosRepository>();
builder.Services.AddScoped<IMatriculaRepository, MatriculaRepository>();

// Handlers
builder.Services.AddScoped<GetActiveRegionesHandler>();
builder.Services.AddScoped<GetActiveDependenciasHandler>();
builder.Services.AddScoped<GetActiveProgramasEducativosHandler>();
builder.Services.AddScoped<GetEstadisticaProgramasEducativosHandler>();
builder.Services.AddScoped<GetDistribucionPorAreaAcademicaHandler>();
builder.Services.AddScoped<GetDistribucionPorRegionHandler>();
builder.Services.AddScoped<GetDistribucionPorModalidadHandler>();
builder.Services.AddScoped<GetDistribucionPorNivelHandler>();
builder.Services.AddScoped<GetAllMatriculaHandler>();
builder.Services.AddScoped<GetEstadisticaMatriculaHandler>();
builder.Services.AddScoped<GetDiscapacidadPorAreaAcademicaHandler>();
builder.Services.AddScoped<GetHablantesLenguaIndigenaHandler>();
builder.Services.AddScoped<GetMatriculaPorProgramaEducativoHandler>();
builder.Services.AddScoped<GetMovilidadPorNivelEducativoHandler>();
builder.Services.AddScoped<GetTrayectoriaAcademicaPorNivelEducativoHandler>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.TryGetValue("token", out var token))
                    context.Token = token;
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

builder.Services
    .AddApiVersioning(options =>
    {
        options.DefaultApiVersion = new Asp.Versioning.ApiVersion(1, 0);
        options.AssumeDefaultVersionWhenUnspecified = true;
        options.ReportApiVersions = true;
        options.ApiVersionReader = new Asp.Versioning.UrlSegmentApiVersionReader();
    })
    .AddMvc()
    .AddApiExplorer(options =>
    {
        options.GroupNameFormat = "'v'VVV";
        options.SubstituteApiVersionInUrl = true;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.ConfigureOptions<ConfigureSwaggerOptions>();

var app = builder.Build();

if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("DevelopmentLocal"))
{
    var versionProvider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();

    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        foreach (var description in versionProvider.ApiVersionDescriptions)
        {
            options.SwaggerEndpoint(
                $"/swagger/{description.GroupName}/swagger.json",
                $"UV SIGE API {description.GroupName.ToUpperInvariant()}"
            );
        }
    });
}

app.UseCors("Frontend");
if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
