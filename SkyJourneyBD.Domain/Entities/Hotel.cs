using SkyJourneyBD.Domain.Common;

namespace SkyJourneyBD.Domain.Entities;

public class Hotel : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int StarRating { get; set; }
    public decimal PricePerNight { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Amenities { get; set; } // JSON
    public bool IsActive { get; set; } = true;

    public ICollection<HotelImage> Images { get; set; } = new List<HotelImage>();
}