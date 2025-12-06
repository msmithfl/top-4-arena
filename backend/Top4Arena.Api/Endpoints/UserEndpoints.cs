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
                createdAt = user.CreatedAt
            });
        })
        .WithName("GetCurrentUser");
    }
}
