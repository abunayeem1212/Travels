namespace SkyJourneyBD.Application.DTOs.Packages;

public class PackageDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string Duration { get; set; } = string.Empty;
    public string? Includes { get; set; }
    public string? Itinerary { get; set; }
    public bool IsPopular { get; set; }
    public List<PackageImageDto> Images { get; set; } = new();
}

