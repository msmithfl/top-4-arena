namespace Top4Arena.Api.Models.Entities;

public class User
{
    public string Id { get; set; } = string.Empty; // Clerk user ID
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Game stats
    public int BestRun { get; set; } = 0; // All-time furthest round reached
    public int TotalGames { get; set; } = 0;
    public int HighestCombo { get; set; } = 0; // Highest damage dealt in single attack
    
    // Period leaderboard tracking
    public int LastGameRound { get; set; } = 0; // Round reached in most recent game
    public DateTime? LastGameAt { get; set; } // When the last game was played
}
