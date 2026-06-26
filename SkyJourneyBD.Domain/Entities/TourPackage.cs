using SkyJourneyBD.Domain.Common;

namespace SkyJourneyBD.Domain.Entities;

public class TourPackage : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string Duration { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? Includes { get; set; } // JSON
    public string? Itinerary { get; set; } // JSON
    public bool IsPopular { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<PackageImage> Images { get; set; } = new List<PackageImage>();
    public ICollection<BookingInquiry> Inquiries { get; set; } = new List<BookingInquiry>();
}