using SkyJourneyBD.Domain.Common;

namespace SkyJourneyBD.Domain.Entities;

public class ContactMessage : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;

    public bool IsRead { get; set; } = false;
    public string? AdminReply { get; set; }
    public DateTime? RepliedAt { get; set; }
}