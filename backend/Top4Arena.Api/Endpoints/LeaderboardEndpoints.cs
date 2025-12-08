using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Top4Arena.Api.Data;

namespace Top4Arena.Api.Endpoints;

public static class LeaderboardEndpoints
{
    public static void MapLeaderboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/leaderboard");

        // Get top 10 leaderboard (public - no auth required)
        group.MapGet("", async (AppDbContext db, string? period) =>
        {
            var query = db.Users.Where(u => u.BestRun > 0);

            // Filter by time period
            if (period == "daily")
            {
                var yesterday = DateTime.UtcNow.AddDays(-1);
                query = query.Where(u => u.LastHighScoreAt.HasValue && u.LastHighScoreAt >= yesterday);
            }
            else if (period == "weekly")
            {
                var lastWeek = DateTime.UtcNow.AddDays(-7);
                query = query.Where(u => u.LastHighScoreAt.HasValue && u.LastHighScoreAt >= lastWeek);
            }
            // "all-time" or null - no additional filtering

            var leaderboard = await query
                .OrderByDescending(u => u.BestRun)
                .ThenByDescending(u => u.HighestCombo)
                .Take(10)
                .Select(u => new
                {
                    username = u.Username,
                    bestRun = u.BestRun
                })
                .ToListAsync();

            return Results.Ok(leaderboard);
        })
        .WithName("GetLeaderboard")
        .AllowAnonymous();

        // Submit score (requires authentication)
        group.MapPost("/submit", async (HttpContext context, AppDbContext db, SubmitScoreRequest request) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var user = await db.Users.FindAsync(userId);
            
            if (user == null)
                return Results.NotFound(new { error = "User not found" });

            // Flag suspicious submissions
            if (request.Round > 100)
            {
                Console.WriteLine($"FLAGGED: User {user.Username} (ID: {userId}) submitted suspicious score - Round: {request.Round}, Combo: {request.HighestCombo}");
                return Results.BadRequest(new { error = "Invalid score submission" });
            }

            // Update total games
            user.TotalGames++;

            // Update best run if current round is higher
            if (request.Round > user.BestRun)
            {
                user.BestRun = request.Round;
                user.LastHighScoreAt = DateTime.UtcNow;
            }

            // Update highest combo if current combo is higher
            if (request.HighestCombo.HasValue && request.HighestCombo.Value > user.HighestCombo)
            {
                user.HighestCombo = request.HighestCombo.Value;
            }

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                bestRun = user.BestRun,
                totalGames = user.TotalGames,
                highestCombo = user.HighestCombo
            });
        })
        .WithName("SubmitScore")
        .RequireAuthorization();
    }
}

public record SubmitScoreRequest(int Round, int? HighestCombo);
