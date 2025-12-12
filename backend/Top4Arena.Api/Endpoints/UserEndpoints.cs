using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Top4Arena.Api.Data;

namespace Top4Arena.Api.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users")
            .RequireAuthorization();

        group.MapGet("/me", async (HttpContext context, AppDbContext db) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var user = await db.Users.FindAsync(userId);
            
            if (user == null)
                return Results.NotFound(new { error = "User not found" });

            return Results.Ok(new
            {
                id = user.Id,
                firstName = user.FirstName,
                lastName = user.LastName,
                username = user.Username,
                email = user.Email,
                createdAt = user.CreatedAt,
                bestRun = user.BestRun,
                totalGames = user.TotalGames,
                highestCombo = user.HighestCombo
            });
        })
        .WithName("GetCurrentUser");

        group.MapPost("/me/stats", async (HttpContext context, AppDbContext db, GameStatsRequest request) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var user = await db.Users.FindAsync(userId);
            
            if (user == null)
                return Results.NotFound(new { error = "User not found" });

            // Update total games
            user.TotalGames++;

            // Update best run if current round is higher
            if (request.Round > user.BestRun)
            {
                user.BestRun = request.Round;
            }

            // Update highest combo if current combo is higher
            if (request.HighestCombo > user.HighestCombo)
            {
                user.HighestCombo = request.HighestCombo;
            }

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                bestRun = user.BestRun,
                totalGames = user.TotalGames,
                highestCombo = user.HighestCombo
            });
        })
        .WithName("UpdateUserStats");

        // NEW: Get user's awards
        group.MapGet("/awards", async (HttpContext context, AppDbContext db) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var user = await db.Users.FindAsync(userId);
            
            if (user == null)
                return Results.NotFound(new { error = "User not found" });

            return Results.Ok(new { awardIds = user.AwardIds });
        })
        .WithName("GetUserAwards");

        // NEW: Unlock award
        group.MapPost("/awards/unlock", async (
            HttpContext context, 
            AppDbContext db, 
            UnlockAwardRequest request
        ) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var user = await db.Users.FindAsync(userId);
            
            if (user == null)
                return Results.NotFound(new { error = "User not found" });

            // Check if already unlocked
            if (user.AwardIds.Contains(request.AwardId))
            {
                return Results.Ok(new { message = "Award already unlocked" });
            }

            // Add award to array
            user.AwardIds = user.AwardIds.Append(request.AwardId).ToArray();
            await db.SaveChangesAsync();

            return Results.Ok(new { 
                message = "Award unlocked!",
                awardIds = user.AwardIds 
            });
        })
        .WithName("UnlockAward");

        // NEW: Unlock multiple awards at once
        group.MapPost("/awards/unlock-batch", async (
            HttpContext context, 
            AppDbContext db, 
            UnlockAwardBatchRequest request
        ) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var user = await db.Users.FindAsync(userId);
            
            if (user == null)
                return Results.NotFound(new { error = "User not found" });

            // Get unique new awards that aren't already unlocked
            var newAwards = request.AwardIds
                .Distinct()
                .Where(id => !user.AwardIds.Contains(id))
                .ToArray();

            if (newAwards.Length == 0)
            {
                return Results.Ok(new { message = "All awards already unlocked" });
            }

            // Add all new awards to array
            user.AwardIds = user.AwardIds.Concat(newAwards).ToArray();
            await db.SaveChangesAsync();

            return Results.Ok(new { 
                message = $"{newAwards.Length} award(s) unlocked!",
                awardIds = user.AwardIds,
                newlyUnlocked = newAwards
            });
        })
        .WithName("UnlockAwardBatch");
    }
}

public record GameStatsRequest(int Round, int HighestCombo);
public record UnlockAwardRequest(string AwardId);
public record UnlockAwardBatchRequest(string[] AwardIds);
