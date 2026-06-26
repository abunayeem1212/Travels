using SkyJourneyBD.Domain.Common;
using SkyJourneyBD.Domain.Enums;

namespace SkyJourneyBD.Domain.Entities;

public class Gallery : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string MediaUrl { get; set; } = string.Empty;
    public string? PublicId { get; set; }
    public MediaType MediaType { get; set; } = MediaType.Photo;
    public string? Category { get; set; }   // "Cox's Bazar", "Sundarbans" ইত্যাদি
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}