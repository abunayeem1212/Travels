using SkyJourneyBD.Domain.Enums;

namespace SkyJourneyBD.Application.DTOs.Gallery;

public class GalleryItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string MediaUrl { get; set; } = string.Empty;
    public string MediaType { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int DisplayOrder { get; set; }
}

public class CreateGalleryDto
{
    public string Title { get; set; } = string.Empty;
    public MediaType MediaType { get; set; } = MediaType.Photo;
    public string? Category { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}