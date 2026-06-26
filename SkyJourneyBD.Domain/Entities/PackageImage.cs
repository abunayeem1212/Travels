using SkyJourneyBD.Domain.Common;

namespace SkyJourneyBD.Domain.Entities;

public class PackageImage : BaseEntity
{
    public int PackageId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? PublicId { get; set; } // Cloudinary public ID (delete এর জন্য)
    public int DisplayOrder { get; set; } = 0;
    public bool IsCover { get; set; } = false;

    public TourPackage Package { get; set; } = null!;
}