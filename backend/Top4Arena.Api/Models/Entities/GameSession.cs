using System;

namespace Top4Arena.Api.Models.Entities;

public class GameSession
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int Round { get; set; }
    public int? HighestCombo { get; set; }
    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;
    // Navigation property
    public User? User { get; set; }
}
