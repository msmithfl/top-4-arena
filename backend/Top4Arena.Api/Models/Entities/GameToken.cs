namespace Top4Arena.Api.Models.Entities;

public class GameToken
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool Used { get; set; } = false;
    
    public User? User { get; set; }
}