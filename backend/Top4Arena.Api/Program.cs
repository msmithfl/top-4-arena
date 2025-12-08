using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Top4Arena.Api.Data;
using Top4Arena.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Database - handle both Railway URL format and standard connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    // Try DATABASE_URL (Railway default)
    var databaseUrl = builder.Configuration["DATABASE_URL"];
    if (!string.IsNullOrEmpty(databaseUrl))
    {
        // Convert postgresql:// URL to Npgsql format
        var uri = new Uri(databaseUrl);
        connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={uri.UserInfo.Split(':')[0]};Password={uri.UserInfo.Split(':')[1]};SSL Mode=Require;Trust Server Certificate=true";
    }
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Clerk JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = $"https://{builder.Configuration["Clerk:Domain"]}";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://{builder.Configuration["Clerk:Domain"]}",
            ValidateAudience = false,
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();

// Dynamic CORS - reads from environment variable or appsettings.{Environment}.json
var corsOriginsEnv = builder.Configuration["CORS_ORIGINS"];
string[] corsOrigins;

if (!string.IsNullOrEmpty(corsOriginsEnv))
{
    // Split comma-separated environment variable
    corsOrigins = corsOriginsEnv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
}
else
{
    // Fallback to JSON configuration
    var corsOriginsSection = builder.Configuration.GetSection("CorsOrigins");
    corsOrigins = corsOriginsSection.Get<string[]>() 
        ?? corsOriginsSection.Get<List<string>>()?.ToArray()
        ?? new[] { "http://localhost:5173" }; // Final fallback for local dev
}

Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
Console.WriteLine($"CORS Origins: {string.Join(", ", corsOrigins)}");

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");  // CORS must be before HTTPS redirection
app.UseAuthentication();
app.UseAuthorization();

// Health check
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
    .WithName("HealthCheck");

// Register endpoints
app.MapWebhookEndpoints();
app.MapUserEndpoints();
app.MapTop4PresetEndpoints();
app.MapLeaderboardEndpoints();

await app.MigrateDbAsync();

app.Run();
