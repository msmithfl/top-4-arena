namespace Top4Arena.Api.Models.Entities;

public class Top4Preset
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int[] MovieIds { get; set; } = Array.Empty<int>(); // Store TMDB movie IDs
    public bool IsDefault { get; set; } = false; // For "Use my top 4 by default" checkbox
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public User User { get; set; } = null!;
}
