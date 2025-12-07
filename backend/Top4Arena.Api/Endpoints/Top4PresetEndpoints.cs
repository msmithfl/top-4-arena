using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Top4Arena.Api.Data;
using Top4Arena.Api.Models.Entities;

namespace Top4Arena.Api.Endpoints;

public static class Top4PresetEndpoints
{
    public static void MapTop4PresetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users/me/top4")
            .RequireAuthorization();

        // GET current user's Top 4 preset
        group.MapGet("", async (HttpContext context, AppDbContext db) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var preset = await db.Top4Presets
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.UpdatedAt)
                .FirstOrDefaultAsync();

            if (preset == null)
                return Results.Ok(new { movieIds = Array.Empty<int>(), isDefault = false });

            return Results.Ok(new
            {
                movieIds = preset.MovieIds,
                isDefault = preset.IsDefault,
                updatedAt = preset.UpdatedAt
            });
        })
        .WithName("GetTop4Preset");

        // POST/PUT - Save or update Top 4 preset
        group.MapPost("", async (HttpContext context, AppDbContext db, Top4PresetRequest request) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            // Validate movie IDs (should be 0-4 movies)
            if (request.MovieIds.Length > 4)
                return Results.BadRequest(new { error = "Cannot have more than 4 movies" });

            var existingPreset = await db.Top4Presets
                .Where(t => t.UserId == userId)
                .FirstOrDefaultAsync();

            if (existingPreset != null)
            {
                // Update existing preset
                existingPreset.MovieIds = request.MovieIds;
                existingPreset.IsDefault = request.IsDefault;
                existingPreset.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                // Create new preset
                var preset = new Top4Preset
                {
                    UserId = userId,
                    MovieIds = request.MovieIds,
                    IsDefault = request.IsDefault,
                    UpdatedAt = DateTime.UtcNow
                };
                db.Top4Presets.Add(preset);
            }

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                movieIds = request.MovieIds,
                isDefault = request.IsDefault,
                message = "Top 4 preset saved successfully"
            });
        })
        .WithName("SaveTop4Preset");

        // DELETE - Clear Top 4 preset
        group.MapDelete("", async (HttpContext context, AppDbContext db) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var preset = await db.Top4Presets
                .Where(t => t.UserId == userId)
                .FirstOrDefaultAsync();

            if (preset != null)
            {
                db.Top4Presets.Remove(preset);
                await db.SaveChangesAsync();
            }

            return Results.Ok(new { message = "Top 4 preset cleared" });
        })
        .WithName("DeleteTop4Preset");
    }
}

public record Top4PresetRequest(int[] MovieIds, bool IsDefault);
