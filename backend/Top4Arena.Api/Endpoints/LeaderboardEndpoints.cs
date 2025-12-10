using Microsoft.EntityFrameworkCore;
using Top4Arena.Api.Models.Entities;
using System.Security.Claims;
using Top4Arena.Api.Data;

namespace Top4Arena.Api.Endpoints;

public static class LeaderboardEndpoints
{
    public static void MapLeaderboardEndpoints(this IEndpointRouteBuilder app)
    {
        //var group = app.MapGroup("/api/leaderboard");
        var leaderboardGroup = app.MapGroup("/api/leaderboard");
        var gameGroup = app.MapGroup("/api/game");

        // Get top 10 leaderboard (public - no auth required)
        leaderboardGroup.MapGet("", async (AppDbContext db, string? period) =>
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

        gameGroup.MapPost("/init", async (HttpContext context, AppDbContext db) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            // Guest users: return a temporary client-side token
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Ok(new { 
                    gameId = $"guest-{Guid.NewGuid()}", 
                    isGuest = true 
                });
            }

            var gameToken = new GameToken
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddHours(2),
                Used = false
            };

            db.GameTokens.Add(gameToken);
            await db.SaveChangesAsync();

            return Results.Ok(new { gameId = gameToken.Id, isGuest = false });
        })
        .WithName("InitGame")
        .AllowAnonymous(); // Allow guests!

        // Submit score (requires authentication)
        leaderboardGroup.MapPost("/submit", async (HttpContext context, AppDbContext db, SubmitScoreRequest request) =>
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Results.Ok(new { message = "Sign in to save your score to the leaderboard!" });

            var user = await db.Users.FindAsync(userId);
            
            if (user == null)
                return Results.NotFound(new { error = "User not found" });

            GameToken? gameToken = null;

            // Token validation - only for non-guest tokens
            if (!request.gameId.StartsWith("guest-"))
            {
                gameToken = await db.GameTokens.FindAsync(request.gameId); // Assign here
                    
                if (gameToken == null || gameToken.UserId != userId || gameToken.Used)
                    return Results.BadRequest(new { error = "Invalid game session" });
                    
                // Simple time check (15 seconds per round minimum)
                var duration = DateTime.UtcNow - gameToken.CreatedAt;
                var minDuration = TimeSpan.FromSeconds(request.Round * 10);
                    
                if (duration < minDuration)
                    return Results.BadRequest(new { error = "Game completed too quickly" });

                // Check if token is expired
                // if (DateTime.UtcNow > gameToken.ExpiresAt)
                //     return Results.BadRequest(new { error = "Game session expired" });
                    
                // Mark as used
                gameToken.Used = true;
            }

            // Flag suspicious submissions
            if (request.Round > 80)
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

            await db.SaveChangesAsync(); // ✅ Now EF can track gameToken changes

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

public record SubmitScoreRequest(string gameId, int Round, int? HighestCombo);
