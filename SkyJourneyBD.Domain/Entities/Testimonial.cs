using SkyJourneyBD.Domain.Common;

namespace SkyJourneyBD.Domain.Entities;

public class Testimonial : BaseEntity
{
    public string CustomerName { get; set; } = string.Empty;
    public string? Location { get; set; }       // "Dhaka, Bangladesh"
    public string ReviewText { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;        // 1–5 star
    public string? AvatarUrl { get; set; }
    public string? PublicId { get; set; }
    public bool IsActive { get; set; } = true;
}