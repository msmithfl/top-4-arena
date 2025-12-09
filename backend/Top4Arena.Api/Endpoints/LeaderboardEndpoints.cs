using Microsoft.EntityFrameworkCore;
using Top4Arena.Api.Models.Entities;
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
            if (period == "daily" || period == "weekly")
            {
                DateTime periodStart = period == "daily"
                    ? DateTime.UtcNow.Date.AddDays(-1)
                    : DateTime.UtcNow.Date.AddDays(-7);

                // Get best round per user in the period
                var leaderboard = await db.GameSessions
                    .Where(gs => gs.PlayedAt >= periodStart)
                    .GroupBy(gs => gs.UserId)
                    .Select(g => new
                    {
                        UserId = g.Key,
                        bestRun = g.Max(x => x.Round)
                    })
                    .OrderByDescending(x => x.bestRun)
                    .Take(10)
                    .Join(db.Users,
                        g => g.UserId,
                        u => u.Id,
                        (g, u) => new
                        {
                            username = u.Username,
                            bestRun = g.bestRun
                        })
                    .ToListAsync();

                return Results.Ok(leaderboard);
            }
            else
            {
                // "all-time" - use BestRun from User table
                var allTimeLeaderboard = await db.Users
                    .Where(u => u.BestRun > 0)
                    .OrderByDescending(u => u.BestRun)
                    .ThenByDescending(u => u.HighestCombo)
                    .Take(10)
                    .Select(u => new
                    {
                        username = u.Username,
                        bestRun = u.BestRun
                    })
                    .ToListAsync();

                return Results.Ok(allTimeLeaderboard);
            }
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

            // Update all-time best run if current round is higher
            if (request.Round > user.BestRun)
            {
                user.BestRun = request.Round;
            }

            // Update highest combo if current combo is higher
            if (request.HighestCombo.HasValue && request.HighestCombo.Value > user.HighestCombo)
            {
                user.HighestCombo = request.HighestCombo.Value;
            }

            // Create a new GameSession record
            var session = new GameSession
            {
                UserId = userId,
                Round = request.Round,
                HighestCombo = request.HighestCombo,
                PlayedAt = DateTime.UtcNow
            };
            db.GameSessions.Add(session);

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
