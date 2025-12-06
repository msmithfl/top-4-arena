using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Top4Arena.Api.Data;
using Top4Arena.Api.Models.Entities;

namespace Top4Arena.Api.Endpoints;

public static class WebhookEndpoints
{
    public static void MapWebhookEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/webhooks");

        group.MapPost("/clerk", async (HttpContext context, AppDbContext db) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            var payload = await reader.ReadToEndAsync();

            try
            {
                var webhookData = JsonSerializer.Deserialize<JsonElement>(payload);
                var eventType = webhookData.GetProperty("type").GetString();

                if (eventType == "user.created")
                {
                    var data = webhookData.GetProperty("data");
                    var userId = data.GetProperty("id").GetString()!;
                    
                    // Check if user already exists (prevent duplicates)
                    var existingUser = await db.Users.FindAsync(userId);
                    if (existingUser != null)
                    {
                        return Results.Ok(new { received = true, message = "User already exists" });
                    }
                    
                    // Get name fields
                    var firstName = data.TryGetProperty("first_name", out var fn) ? fn.GetString() : null;
                    var lastName = data.TryGetProperty("last_name", out var ln) ? ln.GetString() : null;
                    var username = data.GetProperty("username").GetString();
                    
                    // Get email
                    var emailAddresses = data.GetProperty("email_addresses");
                    var primaryEmail = "";
                    if (emailAddresses.GetArrayLength() > 0)
                    {
                        primaryEmail = emailAddresses[0].GetProperty("email_address").GetString()!;
                    }

                    var user = new User
                    {
                        Id = userId,
                        FirstName = firstName,
                        LastName = lastName,
                        Username = username ?? primaryEmail.Split('@')[0],
                        Email = primaryEmail,
                        CreatedAt = DateTime.UtcNow
                    };

                    db.Users.Add(user);
                    await db.SaveChangesAsync();
                }
                else if (eventType == "user.updated")
                {
                    var data = webhookData.GetProperty("data");
                    var userId = data.GetProperty("id").GetString()!;
                    
                    var user = await db.Users.FindAsync(userId);
                    if (user != null)
                    {
                        // Update name fields
                        user.FirstName = data.TryGetProperty("first_name", out var fn) ? fn.GetString() : user.FirstName;
                        user.LastName = data.TryGetProperty("last_name", out var ln) ? ln.GetString() : user.LastName;
                        
                        // Update username
                        if (data.TryGetProperty("username", out var un) && un.ValueKind != JsonValueKind.Null)
                        {
                            user.Username = un.GetString() ?? user.Username;
                        }
                        
                        // Update email if changed
                        var emailAddresses = data.GetProperty("email_addresses");
                        if (emailAddresses.GetArrayLength() > 0)
                        {
                            var primaryEmail = emailAddresses[0].GetProperty("email_address").GetString()!;
                            user.Email = primaryEmail;
                        }
                        
                        await db.SaveChangesAsync();
                    }
                }
                else if (eventType == "user.deleted")
                {
                    var data = webhookData.GetProperty("data");
                    var userId = data.GetProperty("id").GetString()!;
                    
                    var user = await db.Users.FindAsync(userId);
                    if (user != null)
                    {
                        db.Users.Remove(user);
                        await db.SaveChangesAsync();
                    }
                }

                return Results.Ok(new { received = true });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });
    }
}
