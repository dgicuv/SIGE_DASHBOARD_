using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SIGE.Dashboard;

public class SlidingJwtMiddleware(RequestDelegate next, IConfiguration config, IWebHostEnvironment env)
{
    public async Task InvokeAsync(HttpContext context)
    {
        context.Response.OnStarting(() =>
        {
            if (context.User.Identity?.IsAuthenticated != true) return Task.CompletedTask;

            var expClaim = context.User.FindFirstValue(JwtRegisteredClaimNames.Exp);
            if (!long.TryParse(expClaim, out var expUnix)) return Task.CompletedTask;

            var expiry = DateTimeOffset.FromUnixTimeSeconds(expUnix);
            var expiresInMinutes = config.GetValue<int>("Jwt:ExpiresInMinutes");
            var halfLife = TimeSpan.FromMinutes(expiresInMinutes / 2.0);

            if (expiry - DateTimeOffset.UtcNow < halfLife)
                IssueNewToken(context, expiresInMinutes);

            return Task.CompletedTask;
        });

        await next(context);
    }

    private void IssueNewToken(HttpContext context, int expiresInMinutes)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = context.User.Claims
            .Where(c => c.Type != JwtRegisteredClaimNames.Exp
                     && c.Type != JwtRegisteredClaimNames.Nbf
                     && c.Type != JwtRegisteredClaimNames.Iat
                     && c.Type != JwtRegisteredClaimNames.Jti)
            .ToList();

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            signingCredentials: creds
        );

        context.Response.Cookies.Append("token", new JwtSecurityTokenHandler().WriteToken(token), new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Lax,
            Secure = !env.IsDevelopment(),
            Expires = DateTimeOffset.UtcNow.AddMinutes(expiresInMinutes),
            Path = "/",
        });
    }
}
