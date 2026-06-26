using SkyJourneyBD.Domain.Common;

namespace SkyJourneyBD.Domain.Entities;

public class TeamMember : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public string? PublicId { get; set; }
    public string? FacebookUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}