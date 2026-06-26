using SkyJourneyBD.Domain.Common;

namespace SkyJourneyBD.Domain.Entities;

public class Banner : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? PublicId { get; set; }
    public string? LinkUrl { get; set; }   // CTA button এ click করলে কোথায় যাবে
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}