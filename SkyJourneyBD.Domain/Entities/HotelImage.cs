using SkyJourneyBD.Domain.Common;

namespace SkyJourneyBD.Domain.Entities;

public class HotelImage : BaseEntity
{
    public int HotelId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? PublicId { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsCover { get; set; } = false;

    public Hotel Hotel { get; set; } = null!;
}